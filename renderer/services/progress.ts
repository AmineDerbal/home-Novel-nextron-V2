const updateProgress = async (
  novelName: string,
  currentChapter: number,
  numberOfChapters: number,
) => {
  const progress = {
    novelName,
    numberOfChapters,
    currentChapter,
    progress: Math.round((currentChapter / numberOfChapters) * 100),
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      progress,
    }),
  };
  const response = await fetch('api/novel/progress', options);
  const data = await response.json();
  return data;
};

const getProgress = async () => {
  const response = await fetch('api/novel/progress');
  const data = await response.json();
  return data;
};

export { updateProgress, getProgress };
