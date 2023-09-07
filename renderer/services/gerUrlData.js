import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer';

puppeteer.use(StealthPlugin());

const isNextPageLink = async (page) => {
  try {
    return await page.$("a[class='page-link next']");
  } catch (error) {
    return false;
  }
};
const isNextPageHref = async (page) => {
  try {
    const nextPageHref = await page.$eval("a[class='page-link next']", (el) => el.href);
    return /\?toc/.test(nextPageHref);
  } catch (error) {
    return false;
  }
};

const getChapterList = async (page) => {
  const chapters = await page.$$('.toc_a');
  return chapters;
};

const getChapterData = async (page, chapter) => {
  const link = await page.evaluate((el) => el.href, chapter);
  const title = await page.evaluate((el) => el.innerHTML, chapter);
  return {
    title,
    link,
  };
};

const generateChaptersList = async (page, chaptersList = []) => {
  try {
    const chapters = await getChapterList(page);
    for (let i = 0; i < chapters.length; i += 1) {
      const chapter = chapters[i];
      chaptersList.push(getChapterData(page, chapter));
    }
    if ((await isNextPageHref(page)) && (await isNextPageLink(page))) {
      await page.goto(await page.$eval("a[class='page-link next']", (el) => el.href));
      return generateChaptersList(page, chaptersList);
    }
    return chaptersList;
  } catch (error) {
    return {
      status: 'Error',
      message: 'an error has occured',
    };
  }
};

const getData = async (url) => {
  try {
    const browser = await puppeteer.launch({ executablePath: executablePath(), headless: false });
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
    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 0,
    });
    if (response.status() !== 200) {
      return {
        status: 'Error',
        message: 'an error has occured',
      };
    }
    let newUrl = url;
    const urlRead = /\/read\//;
    if (urlRead.test(newUrl)) {
      const indexSerie = await page.$('.c_index a');
      const serieUrl = await page.evaluate((el) => el.href, indexSerie);
      await page.goto(serieUrl);
      newUrl = serieUrl;
    }
    // if url has toc path in the end eg : ?toc=11#content1
    const serieMatch = /(https?:\/\/www.scribblehub.com\/series\/\d+\/(\w|\W)*\/)\?toc=\d/;
    if (serieMatch.test(newUrl)) {
      [, newUrl] = newUrl.match(serieMatch);
    }

    const serieName = await page.$eval('.fic_title', (el) => el.innerHTML);
    console.log('serie name', serieName);
    const serieImageSrc = await page.$eval('.fic_image img', (el) => el.src);
    const authorName = await page.$eval('.auth_name_fic', (el) => el.textContent);
    const authorLink = await page.$eval("span[property='name'] a", (el) => el.href);
    const lastUpdate = await page.$eval(
      '.toc_ol:first-child .fic_date_pub',
      (el) => el.textContent,
    );
    const synopsis = await page.$eval('.wi_fic_desc', (el) => el.innerText);

    const chapters = await generateChaptersList(page);
    browser.close();
    if (chapters.status || chapters.status === 'Error') {
      return {
        status: 'Error',
        message: 'an error has occured',
      };
    }

    return {
      status: 'Success',
      chapterData: {
        serieName,
        serieImageSrc,
        authorName,
        authorLink,
        lastUpdate,
        synopsis,
        chapters,
      },
    };
  } catch (error) {
    return {
      status: 'Error',
      message: 'an error has occured',
    };
  }
};

export default getData;
