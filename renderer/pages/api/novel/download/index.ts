import buildDownload from '../../../../services/buildDownload';

const handler = async (req: any, res: any) => {
  if (req.method === 'POST') {
    console.log('req', req.body);
    const { novel, browser } = req.body;
    //console.log('browser', browser);
    const newBrowser = JSON.parse(browser);
    console.log('newBrowser', newBrowser);

    try {
      const response = await buildDownload(novel, browser);
      if (!response.success) {
        return res
          .status(500)
          .json({ error: 'An error occurred while fetching the data' });
      }
      return res.json({ success: 'success' });
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'An error occurred while fetching the data' });
    }
  }
  return res.status(400).json({ error: 'Invalid request method' });
};

export default handler;
