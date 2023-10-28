import PDFDocument from 'pdfkit';
import fs from 'fs';
import axios from 'axios';
import { getDefaultDownloadPath } from '../utils/config';
import { Browser, Page } from 'puppeteer';
import { openPage } from './executePuppeteer';
import { get } from 'http';

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
};

const pipePdf = async (doc: PDFDocument, serieName: string) => {
  const path = (await getDefaultDownloadPath()).defaultDownloadPath;
  console.log('path', path);
  doc.pipe(
    fs.createWriteStream(
      `${path}/${serieName.replace(/[^a-zA-Z0-9 ]/g, '')}.pdf`,
    ),
  );
  doc.font('Times-Bold').fontSize(35).text(serieName, { align: 'center' });
  doc.moveDown();
};

const fetchImage = async (src: string) => {
  const image = await axios.get(src, {
    responseType: 'arraybuffer',
  });
  return image.data;
};

const generateSerieImage = async (doc: PDFDocument, serieImageSrc: string) => {
  const image = await fetchImage(serieImageSrc);
  const imageWidth = 180;

  doc
    .image(image, doc.page.width / 2 - imageWidth / 2, doc.y, {
      width: imageWidth,
    })
    .stroke();
  movePdfDocDown(doc, 0.5);
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
  console.log(tag);
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
      const text = await page.evaluate((el) => el.textContent, element);
      console.log(text);
      doc.font('Times-Roman').fontSize(16).text(text, { align, lineGap: 1.2 });
      // if (text.trim() !== '') {
      //   //console.log(text);
      //   doc
      //     .font('Times-Roman')
      //     .color('black')
      //     .fontSize(16)
      //     .text(text, { align });
      // } else {
      //   console.log('this does not contain text');
      // }
      break;
    case 'IMG':
      break;
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
  doc.addPage();
  doc.font('Times-Bold').fontSize(25).text(title, { align: 'center' });
  const chapterContent = await page.$$('#chp_raw > *');
  console.log(title);
  for (const element of chapterContent) {
    await parseElementText(page, doc, element);
  }
  page.close();
};
const generateNovelChapters = async (
  doc: PDFDocument,
  browser: Browser,
  chapters: Array<{ title: string; link: string; updateDate: string }>,
) => {
  for (const chapter of chapters) {
    const { title, link } = chapter;
    await addChapterToPdf(doc, browser, title, link);
  }
};

export {
  createPdf,
  pipePdf,
  generateSerieImage,
  generateNovelInfos,
  generateNovelChapters,
};