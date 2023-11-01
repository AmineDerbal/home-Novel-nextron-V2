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
    body: JSON.stringify({
      progress,
    }),
  };
  const response = await fetch(
    'http://localhost:8888/api/novel/progress',
    options,
  );
  const data = await response.json();
  return data;
};

const getProgress = async () => {
  console.log('getProgress');
  const response = await fetch('http://localhost:8888/api/novel/progress');
  const data = await response.json();
  console.log(data);
  return data;
};

export { updateProgress, getProgress };
