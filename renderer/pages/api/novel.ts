import getData from '../../services/gerUrlData';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { url } = req.body;
      res.json(await getData(url));
    } catch (error) {
      res.json({
        status: 'Error',
        message: 'an error has occured',
      });
    }
  }
  return 'No post';
};

export default handler;
