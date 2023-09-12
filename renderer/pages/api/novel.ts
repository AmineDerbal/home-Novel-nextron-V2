import getData from '../../services/gerUrlData';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { url } = req.body;
      const response = await getData(url)
      console.log('response',response)
      res.json(response);
    } catch (error) {
      //console.error('An error occurred:', error.message);

      // You can send a meaningful error response to the client
      res.status(500).json({ error: 'An error occurred while fetching the data' });
    }
  } else {
    res.status(400).json({ error: 'Invalid request method' });
  }
  return 'No post';
};
  

export default handler;
