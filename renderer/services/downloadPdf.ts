import PDFDocument from 'pdfkit';
import fs from 'fs';
import { getDefaultDownloadPath } from '../utils/config';

const pipePdf = async (doc: PDFDocument, serieName: string) => {
  const path = (await getDefaultDownloadPath()).defaultDownloadPath;
  console.log('path', path);
  doc.pipe(
    fs.createWriteStream(
      `${path}/${serieName.replace(/[^a-zA-Z0-9 ]/g, '')}.pdf`,
    ),
  );
  doc.font('Times-Bold').fontSize(35).text(serieName, { align: 'center' });
  doc.moveDown();
  return doc;
};

const createPdf = () => {
  const doc = new PDFDocument();

  return doc;
};

export { createPdf, pipePdf };
