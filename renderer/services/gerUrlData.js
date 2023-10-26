import { openBrowser, openPage } from './executePuppeteer';

const isNextPageLink = async (page) => {
  try {
    return await page.$("a[class='page-link next']");
  } catch (error) {
    return false;
  }
};
const isNextPageHref = async (page) => {
  try {
    const nextPageHref = await page.$eval(
      "a[class='page-link next']",
      (el) => el.href,
    );
    return /\?toc/.test(nextPageHref);
  } catch (error) {
    return false;
  }
};

const getChapterList = async (page) => {
  const chapters = await page.$$('.toc_a');
  const chaptersUpdateDate = await page.$$('.fic_date_pub');
  return { chapters, chaptersUpdateDate };
};

const getChapterData = async (page, chapter, chaptersUpdateDate) => {
  const link = await page.evaluate((el) => el.href, chapter);
  const title = await page.evaluate((el) => el.textContent, chapter);
  const updateDate = await page.evaluate(
    (el) => el.textContent,
    chaptersUpdateDate,
  );
  return {
    title,
    link,
    updateDate,
  };
};

const generateChaptersList = async (page, chaptersList = []) => {
  try {
    const { chapters, chaptersUpdateDate } = await getChapterList(page);
    for (let i = 0; i < chapters.length; i += 1) {
      const chapter = chapters[i];
      const chapterUpdateDate = chaptersUpdateDate[i];
      chaptersList.push(await getChapterData(page, chapter, chapterUpdateDate));
    }
    if ((await isNextPageHref(page)) && (await isNextPageLink(page))) {
      await page.goto(
        await page.$eval("a[class='page-link next']", (el) => el.href),
      );
      return generateChaptersList(page, chaptersList);
    }
    return chaptersList;
  } catch (error) {
    return {
      status: 'Error',
      message: error.message,
    };
  }
};

const getData = async (url) => {
  try {
    const browser = await openBrowser();
    if (!browser) {
      throw new Error('an error has occured');
    }
    const newPage = await openPage(browser);
    if (!newPage.success) {
      throw new Error('an error has occured');
    }
    const { page } = newPage;
    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 0,
    });
    if (response.status() !== 200) {
      browser.close();
      throw new Error('an error 3 has occured');
    }
    let serieLink = url;
    const urlRead = /\/read\//;
    if (urlRead.test(serieLink)) {
      const indexSerie = await page.$('.c_index a');
      const newSerieUrl = await page.evaluate((el) => el.href, indexSerie);
      await page.goto(newSerieUrl);
      serieLink = newSerieUrl;
    }
    // if url has toc path in the end eg : ?toc=11#content1
    const serieMatch =
      /(https?:\/\/www.scribblehub.com\/series\/\d+\/(\w|\W)*\/)\?toc=\d/;
    if (serieMatch.test(serieLink)) {
      [, serieLink] = serieLink.match(serieMatch);
    }

    const serieName = await page.$eval('.fic_title', (el) => el.textContent);
    const serieImageSrc = await page.$eval('.fic_image img', (el) => el.src);
    const authorName = await page.$eval(
      '.auth_name_fic',
      (el) => el.textContent,
    );
    const authorLink = await page.$eval(
      "span[property='name'] a",
      (el) => el.href,
    );
    const lastUpdate = await page.$eval(
      '.toc_ol:first-child .fic_date_pub',
      (el) => el.textContent,
    );
    const synopsis = await page.$eval('.wi_fic_desc', (el) => el.innerText);

    const chapters = await generateChaptersList(page);
    if (chapters.status || chapters.status === 'Error') {
      browser.close();
      throw new Error('an error has occured');
    }

    browser.close();
    return {
      serieName,
      serieLink,
      serieImageSrc,
      authorName,
      authorLink,
      lastUpdate,
      synopsis,
      chapters,
    };
  } catch (error) {
    browser.close();
    throw new Error(error);
  }
};

export default getData;
