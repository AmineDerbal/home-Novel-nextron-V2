import { connectDb } from '../../utils/db';

const handler = async (req: any, res: any) => {
  if (req.method === 'POST') {
    const { novel } = req.body;
    const db = connectDb();
    const {
      serieName,
      serieLink,
      serieImageSrc,
      authorName,
      authorLink,
      lastUpdate,
      synopsis,
    } = novel;

    const insertQuery = `INSERT INTO novels (serieName, serieLink, serieImageSrc, authorName, authorLink, lastUpdate, synopsis) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      serieName,
      serieLink,
      serieImageSrc,
      authorName,
      authorLink,
      lastUpdate,
      synopsis,
    ];
    try {
      const insertResult = await db.run(insertQuery, values);
      console.log('insertResult', insertResult);
      res.status(201).json({ message: 'Novel created successfully' });
    } catch (error) {
      res
        .status(500)
        .json({ error: 'An error occurred while creating the novel' });
    } finally {
      db.close();
    }
  }
};

export default handler;
