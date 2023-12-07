import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, executablePath } from 'puppeteer';

puppeteer.use(StealthPlugin());

const openBrowser = async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: executablePath(),
    });
    return browser;
  } catch (error) {
    return false;
  }
};

const openPage = async (browser: Browser) => {
  try {
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      'upgrade-insecure-requests': '1',
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9,en;q=0.8',
    });
    await page.setViewport({ width: 1280, height: 720 });
    return { success: true, page };
  } catch (error) {
    return { success: false, error };
  }
};

export { openBrowser, openPage };
