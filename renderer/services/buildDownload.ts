import { openBrowser } from './executePuppeteer';
import { Browser } from 'puppeteer';
import PDFDocument from 'pdfkit';
import {
  createPdf,
  pipePdf,
  generateSerieImage,
  generateNovelInfos,
  generateNovelChapters,
} from './downloadPdf';

type Novel = {
  serieName: string;
  serieLink: string;
  serieImageSrc: string;
  authorName: string;
  authorLink: string;
  lastUpdate: string;
  synopsis: string;
  chapters: Array<{ title: string; link: string; updateDate: string }>;
};

const returnErrorExecution = (error: string) => {
  return {
    success: false,
    error,
  };
};

const stopExecution = (browser: Browser, doc: PDFDocument, error: string) => {
  doc.end();
  browser.close();
  return returnErrorExecution(error);
};

const buildDownload = async (novel: Novel) => {
  const browser = await openBrowser();
  if (!browser) {
    return { success: false, error: 'Unable to open browser' };
  }
  let doc = createPdf();
  const {
    serieName,
    serieLink,
    serieImageSrc,
    authorName,
    authorLink,
    lastUpdate,
    synopsis,
    chapters,
  } = novel;
  try {
    const pipePdfResponse = await pipePdf(doc, serieName);
    if (!pipePdfResponse.success) {
      return stopExecution(browser, doc, pipePdfResponse.error);
    }
    const generateSerieImageResponse = await generateSerieImage(
      doc,
      serieImageSrc,
      200,
    );
    if (!generateSerieImageResponse.success) {
      return stopExecution(browser, doc, generateSerieImageResponse.error);
    }
    const generateNovelInfosResponse = await generateNovelInfos(
      doc,
      authorName,
      serieLink,
      authorLink,
      lastUpdate,
      chapters.length,
      synopsis,
    );
    if (!generateNovelInfosResponse.success) {
      return stopExecution(browser, doc, generateNovelInfosResponse.error);
    }
    const generateNovelChaptersResponse = await generateNovelChapters(
      doc,
      browser,
      chapters.reverse(),
      {
        serieName,
        numberOfChapters: chapters.length,
      },
    );
    if (!generateNovelChaptersResponse.success) {
      return stopExecution(browser, doc, generateNovelChaptersResponse.error);
    }
    doc.end();
    browser.close();

    return { success: true };
  } catch (error) {
    return stopExecution(browser, doc, error);
  }
};

export default buildDownload;
