import { getHomeUrl } from '../../utils/config';

const checkNovel = async (novel: {
  serieName: string;
  serieLink: string;
  authorName: string;
}) => {
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
    const homeUrl = await getHomeUrl();
    const response = await fetch(`${homeUrl}api/novel/check`, options);
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
