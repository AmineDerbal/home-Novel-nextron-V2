import { getHomeUrl } from '../../utils/config';

const updateProgress = async (
  novelName: string,
  currentChapter: number,
  numberOfChapters: number,
  homeUrl: string,
) => {
  const progress = {
    novelName,
    numberOfChapters,
    currentChapter,
    progress: Math.round((currentChapter / numberOfChapters) * 100),
  };

  const options = {
    method: 'POST',
    body: JSON.stringify({
      progress,
    }),
  };

  try {
    const response = await fetch(`${homeUrl}api/novel/progress`, options);
    const data = await response.json();
    if (!data.success) return false;
    return true;
  } catch (error) {
    return false;
  }
};

const getProgress = async () => {
  const homeUrl = await getHomeUrl();
  const response = await fetch(`${homeUrl}api/novel/progress`);
  const data = await response.json();
  return data;
};

export { updateProgress, getProgress };
