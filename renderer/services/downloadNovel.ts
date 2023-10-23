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
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      novel,
    }),
  };
  try {
    const response = await fetch('api/novel/download', options);
    const data = await response.json();
    return data;
  } catch (error) {
    return false;
  }
};

export default downlodaNovel;
