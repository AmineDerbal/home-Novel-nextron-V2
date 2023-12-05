import { getHomeUrl } from '../utils/config';

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

const downlodaNovel = async (novel: Novel) => {
  const homeUrl = await getHomeUrl();
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      novel,
      homeUrl,
    }),
  };
  try {
    const response = await fetch(`${homeUrl}api/novel/download`, options);
    const data = await response.json();
    if (!data.success) return false;
    return true;
  } catch (error) {
    return false;
  }
};

const deleteNovel = async (name: string) => {
  const homeUrl = await getHomeUrl();
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
    }),
  };
  try {
    const response = await fetch(`${homeUrl}api/novel/download`, options);
    const data = await response.json();
    if (data.message === 'Novel deleted successfully') {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export { deleteNovel, downlodaNovel };
