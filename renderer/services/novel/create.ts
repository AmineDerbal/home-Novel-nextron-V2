type Novel = {
  serieName: string;
  serieLink: string;
  serieImageSrc: string;
  authorName: string;
  authorLink: string;
  lastUpdate: string;
  synopsis: string;
};

const createNovel = async (novel: Novel) => {
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
    const response = await fetch('api/novel/create', options);
    const data = await response.json();
    return data;
  } catch (error) {
    return false;
  }
};

export default createNovel;
