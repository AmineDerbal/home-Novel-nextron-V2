import PDFDocument from 'pdfkit';
import fs from 'fs';
import axios from 'axios';
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
};

const fetchImage = async (src: string) => {
  const image = await axios.get(src, {
    responseType: 'arraybuffer',
  });
  return image.data;
};

const generateSerieImage = async (doc: PDFDocument, serieImageSrc: string) => {
  const image = await fetchImage(serieImageSrc);
  const imageWidth = 180;

  doc
    .image(image, doc.page.width / 2 - imageWidth / 2, doc.y, {
      width: imageWidth,
    })
    .stroke();
  doc.moveDown(0.5);
};

const createPdf = () => {
  const doc = new PDFDocument();

  return doc;
};

export { createPdf, pipePdf, generateSerieImage };
