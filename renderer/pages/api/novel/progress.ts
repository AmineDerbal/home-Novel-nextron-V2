import {
  getDownloadProgress,
  updateDownloadProgress,
} from '../../../utils/config';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      let newProgress = req.body;
      newProgress = JSON.parse(newProgress);
      const { novelName, currentChapter, numberOfChapters, progress } =
        newProgress.progress;
      const data = await updateDownloadProgress({
        novelName,
        currentChapter,
        numberOfChapters,
        progress,
      });
      if (!data) {
        return res
          .status(500)
          .json({ success: false, error: 'Error updating download progress' });
      }
      return res.json({ success: 'success' });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  } else if (req.method === 'GET') {
    const data = await getDownloadProgress();
    if (!data.success) {
      return res
        .status(500)
        .json({ success: false, error: 'Error getting download progress' });
    }
    return res.json({ success: true, progress: data.progress });
  } else {
    res.status(400).json({ error: 'Invalid request method' });
  }
};

export default handler;
