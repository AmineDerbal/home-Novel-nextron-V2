import executePuppeteer from './executePuppeteer';

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
  } catch (error) {
    return { success: false, error };
  }
};

export default buildDownload;
