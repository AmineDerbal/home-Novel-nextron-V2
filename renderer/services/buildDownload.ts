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
    await pipePdf(doc, serieName);
    await generateSerieImage(doc, serieImageSrc, 200);
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
    return { success: false, error };
  }
};

export default buildDownload;
