import { connectDb } from '../../utils/db';
import { promisify } from 'util';
const handler = async (req: any, res: any) => {
  if (req.method === 'POST') {
    const { novel } = req.body;
    console.log(novel);
    const { serieName, serieLink, authorName } = novel;
    const db = connectDb();
    const getAsync = promisify(db.get.bind(db));

    try {
      const query = `SELECT * FROM novels WHERE serieName = ? AND serieLink = ? AND authorName = ?`;
      const values = [serieName, serieLink, authorName];
      const row = await getAsync(query, values);
      if (row) {
        return res.json({ message: 'Novel already exists' });
      } else {
        return res.json({ message: 'Novel does not exist' });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'An error occurred while checking the novel' });
    }
  }
};

export default handler;