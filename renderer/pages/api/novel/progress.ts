const handler = async (req, res) => {
  let currentProgress = {
    novelName: '',
    numberOfChapters: 0,
    currentChapter: 0,
    progress: 0,
  };
  if (req.method === 'POST') {
    console.log('Start of progress POST request');
    console.log(currentProgress);
    try {
      const progress = req.body;
      console.log('progress', progress);
      currentProgress = progress;
      // console.log('Received progress:', currentProgress);
      return res.json({ success: 'success' });
    } catch (error) {
      console.error('Error handling POST request:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  } else if (req.method === 'GET') {
    return res.json({ success: true, currentProgress });
  } else {
    res.status(400).json({ error: 'Invalid request method' });
  }
};

export default handler;
