import buildDownload from '../../../../services/buildDownload';

const handler = async (req: any, res: any) => {
  if (req.method === 'POST') {
    const { novel, homeUrl } = req.body;
    try {
      const response = await buildDownload(novel, homeUrl);
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
