import executePuppeteer from './executePuppeteer';
import {
  createPdf,
  pipePdf,
  generateSerieImage,
  generateNovelInfos,
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
    const callPuppeteer = await executePuppeteer();
    if (!callPuppeteer.success) {
      return { success: false, error: callPuppeteer.error };
    }
    const { page, browser } = callPuppeteer;
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
    await generateSerieImage(doc, serieImageSrc);
    await generateNovelInfos(
      doc,
      authorName,
      serieLink,
      authorLink,
      lastUpdate,
      chapters.length,
      synopsis,
    );
    doc.end();
    browser.close();
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export default buildDownload;
