const saveNovel = async (novel) => {
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

export default saveNovel;
