import { openBrowser } from './executePuppeteer';
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

const buildDownload = async (novel: Novel) => {
  try {
    const browser = await openBrowser();
    if (!browser) {
      console.log('Unable to open browser');
      return { success: false, error: 'Unable to open browser' };
    }
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

    let doc = createPdf();
    const pipePdfResponse = await pipePdf(doc, serieName);
    if (!pipePdfResponse.success) {
      return returnErrorExecution(pipePdfResponse.error);
    }
    const generateSerieImageResponse = await generateSerieImage(
      doc,
      serieImageSrc,
      200,
    );
    if (!generateSerieImageResponse.success) {
      return returnErrorExecution(generateSerieImageResponse.error);
    }
    await generateNovelInfos(
      doc,
      authorName,
      serieLink,
      authorLink,
      lastUpdate,
      chapters.length,
      synopsis,
    );
    await generateNovelChapters(doc, browser, chapters.reverse(), {
      serieName,
      numberOfChapters: chapters.length,
    });
    doc.end();
    browser.close();

    return { success: true };
  } catch (error) {
    return returnErrorExecution(error);
  }
};

export default buildDownload;
