const handler = async (req, res) => {
  let currentProgress = {
    novelName: '',
    numberOfChapters: 0,
    currentChapter: 0,
    progress: 0,
  };

  if (req.method === 'POST') {
    const { progress } = req.body;
    currentProgress = progress;
    return res.json({ success: 'success' });
  }
  if (req.method === 'GET') {
    return res.json({ success: true, currentProgress });
  }
  return res.status(400).json({ error: 'Invalid request method' });
};

export default handler;
