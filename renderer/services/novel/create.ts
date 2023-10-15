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
  console.log('start saving');
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
    const response = await fetch('api/createNovel', options);
    const data = await response.json();
    console.log(await data);
    return data;
  } catch (error) {
    return false;
  }
};

export default createNovel;
