const deleteNovel = async (id: string) => {
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
    }),
  };
  try {
    const response = await fetch('api/novel', options);
    const data = await response.json();
    if (data.message === 'Novel deleted successfully') {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export default deleteNovel;
