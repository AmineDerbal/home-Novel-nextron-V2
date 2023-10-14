import { connectDb } from '../../utils/db';
import { promisify } from 'util';

const handler = async (req: any, res: any) => {
  if (req.method === 'DELETE') {
    const { id } = req.body;
    const db = connectDb();
    const runAsync = promisify(db.run.bind(db));

    try {
      const query = `DELETE FROM novels WHERE id = ?`;
      const values = [id];
      await runAsync(query, values);
      return res.json({ message: 'Novel deleted successfully' });
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'An error occurred while deleting the novel' });
    }
  }
};

export default handler;
