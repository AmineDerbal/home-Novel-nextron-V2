import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { getDefaultDownloadPath } from '../utils/config';
import { Browser, Page } from 'puppeteer';
import { openPage } from './executePuppeteer';
import { updateProgress } from './novel';

const movePdfDocDown = (doc: PDFDocument, down: number) => {
  doc.moveDown(down);
};

const addHyperLinkToPdf = (
  doc: PDFDocument,
  defaultText: string,
  link: string,
  inputText: string,
  defaultFontSize = 16,
  color = 'blue',
  defaultFontStyle = 'Times-Roman',
  boldFontStyle = 'Times-Bold',
) => {
  doc
    .fontSize(defaultFontSize)
    .font(boldFontStyle)
    .text(defaultText, {
      continued: true,
    })
    .font(defaultFontStyle)
    .fillColor(color)
    .text(inputText, {
      link: link,
      underline: true,
    });
};
const addTextToPdf = async (
  doc: PDFDocument,
  boldText: string,
  defaultText: string,
  defaultFontSize = 16,
  color = 'black',
  defaultFontStyle = 'Times-Roman',
  boldFontStyle = 'Times-Bold',
) => {
  doc
    .fontSize(defaultFontSize)
    .font(boldFontStyle)
    .fillColor('black')
    .text(boldText, {
      continued: true,
    })
    .fillColor(color)
    .font(defaultFontStyle)
    .text(defaultText)
    .fillColor('black');
};

const generateNovelInfos = async (
  doc: PDFDocument,
  authorName: string,
  serieLink: string,
  authorLink: string,
  lastUpdate: string,
  chaptersNumber: number,
  synopsis: string,
) => {
  try {
    addHyperLinkToPdf(doc, 'Author : ', authorLink, authorName, 16, 'blue');
    movePdfDocDown(doc, 0.5);
    addTextToPdf(doc, 'Serie Link : ', serieLink, 16, 'blue');
    movePdfDocDown(doc, 0.5);
    addTextToPdf(doc, 'Last Update : ', lastUpdate);
    movePdfDocDown(doc, 0.5);
    addTextToPdf(doc, 'number of chapters : ', chaptersNumber.toString());
    movePdfDocDown(doc, 0.5);
    doc.addPage();
    addTextToPdf(doc, 'Synopsis : ', synopsis);
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

const deletePdfFile = async (serieName: string) => {
  try {
    const downloadPath = (await getDefaultDownloadPath()).defaultDownloadPath;
    const filePath = path.join(
      downloadPath,
      `${serieName.replace(/[^a-zA-Z0-9 ]/g, '')}.pdf`,
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    return { success: false };
  }
};

const pipePdf = async (doc: PDFDocument, serieName: string) => {
  try {
    const path = (await getDefaultDownloadPath()).defaultDownloadPath;
    doc.pipe(
      fs.createWriteStream(
        `${path}/${serieName.replace(/[^a-zA-Z0-9 ]/g, '')}.pdf`,
      ),
    );
    doc.font('Times-Bold').fontSize(35).text(serieName, { align: 'center' });
    doc.moveDown();
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

const fetchImage = async (src: string) => {
  const image = await axios.get(src, {
    responseType: 'arraybuffer',
  });
  return image.data;
};

const generateSerieImage = async (
  doc: PDFDocument,
  serieImageSrc: string,
  imageWidth: number,
) => {
  try {
    const image = await fetchImage(serieImageSrc);
    doc
      .image(image, doc.page.width / 2 - imageWidth / 2, doc.y, {
        width: imageWidth,
      })
      .stroke();
    movePdfDocDown(doc, 0.5);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

const createPdf = () => {
  const doc = new PDFDocument();

  return doc;
};

const parseElementText = async (
  page: Page,
  doc: PDFDocument,
  element: any,
  align = 'left',
) => {
  const tag = await page.evaluate((el) => el.tagName, element);
  switch (tag) {
    case 'DIV':
      const style = await page.evaluate(
        (el) => getComputedStyle(el).textAlign,
        element,
      );
      const newElements = await element.$$(':scope > *');

      for (const newElement of newElements) {
        if (style && style === '-webkit-center') {
          await parseElementText(page, doc, newElement, 'center');
        } else {
          await parseElementText(page, doc, newElement);
        }
      }

      break;
    case 'P':
      const img = await element.$(':scope > img');
      if (img) {
        await parseElementText(page, doc, img, align);
      }
      const text = await page.evaluate((el) => el.textContent, element);
      doc.font('Times-Roman').fontSize(16).text(text, { align, lineGap: 2 });
      movePdfDocDown(doc, 0.5);

      break;
    case 'IMG':
      const src = await page.evaluate((el) => el.src, element);
      try {
        const response = await axios.head(src, { timeout: 10000 });
        if (response && response.status === 200) {
          await generateSerieImage(doc, src, 300);
          movePdfDocDown(doc, 0.5);
        }
        break;
      } catch (error) {
        break;
      }
    default:
      break;
  }
};

const addChapterToPdf = async (
  doc: PDFDocument,
  browser: Browser,
  title: string,
  link: string,
) => {
  const newPage = await openPage(browser);
  if (!newPage.success) {
    throw new Error('an error has occured');
  }
  const { page } = newPage;
  const response = await page.goto(link, {
    waitUntil: 'domcontentloaded',
    timeout: 0,
  });
  if (response.status() !== 200) {
    browser.close();
    return { success: false, error: 'an error has occured' };
  }
  try {
    doc.addPage();
    doc.font('Times-Bold').fontSize(25).text(title, { align: 'center' });
    movePdfDocDown(doc, 0.5);
    const chapterContent = await page.$$('#chp_raw > *');

    for (const element of chapterContent) {
      await parseElementText(page, doc, element);
    }
    page.close();
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
const generateNovelChapters = async (
  doc: PDFDocument,
  browser: Browser,
  chapters: Array<{ title: string; link: string; updateDate: string }>,
  novel: {
    serieName: string;
    numberOfChapters: number;
  },
  homeUrl: string,
) => {
  try {
    let currentChapter = 0;
    await updateProgress(
      novel.serieName,
      currentChapter,
      novel.numberOfChapters,
      homeUrl,
    );
    for (const chapter of chapters) {
      const { title, link } = chapter;
      const response = await addChapterToPdf(doc, browser, title, link);
      if (!response.success) {
        return { success: false, error: response.error };
      }
      currentChapter += 1;
      await updateProgress(
        novel.serieName,
        currentChapter,
        novel.numberOfChapters,
        homeUrl,
      );
    }
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export {
  createPdf,
  pipePdf,
  generateSerieImage,
  generateNovelInfos,
  generateNovelChapters,
  deletePdfFile,
};
