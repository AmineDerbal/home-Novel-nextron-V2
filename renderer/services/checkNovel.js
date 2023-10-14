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
    const data = await response.json();
    if (data.message === 'Novel already exists') {
      return {
        success: true,
        id: data.id,
      };
    }
    return { success: false };
  } catch (error) {
    return { success: false };
  }
};

export default checkNovel;
