const checkNovel = async (novel) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        novel,
      }),
    };
    const response = await fetch('api/checkNovel', options);
    const { message } = await response.json();
    if (message === 'Novel already exists') {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
