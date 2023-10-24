import PDFDocument from 'pdfkit';
import fs from 'fs';
import axios from 'axios';
import { getDefaultDownloadPath } from '../utils/config';

const movePdfDocDown = (doc: PDFDocument, down: number) => {
  doc.moveDown(down);
};
const addSerieInfoToPdf = async (
  doc: PDFDocument,
  boldText: string,
  defaultText: string,
  defaultFontSize = 16,
  color = 'black',
  defaultFontStyle = 'Times-Roman',
  boldFontStyle = 'Times-Bold',
) => {
  doc
    .fontSize(defaultFontSize)
    .font(boldFontStyle)
    .text(boldText, {
      continued: true,
    })
    .fillColor(color)
    .font(defaultFontStyle)
    .text(defaultText)
    .fillColor('black');
};

const generateNovelInfos = async (
  doc: PDFDocument,
  authorName: string,
  serieLink: string,
  authorLink: string,
  lastUpdate: string,
  chaptersNumber: number,
  synopsis: string,
) => {
  addSerieInfoToPdf(doc, 'Author : ', authorName);
  movePdfDocDown(doc, 0.5);
  addSerieInfoToPdf(doc, 'Serie Link : ', serieLink, 16, 'blue');
  movePdfDocDown(doc, 0.5);
  addSerieInfoToPdf(doc, 'Author Link : ', authorLink, 16, 'blue');
  movePdfDocDown(doc, 0.5);
  addSerieInfoToPdf(doc, 'Last Update : ', lastUpdate);
  movePdfDocDown(doc, 0.5);
  addSerieInfoToPdf(doc, 'number of chapters : ', chaptersNumber.toString());
  movePdfDocDown(doc, 0.5);
  doc.addPage();
  addSerieInfoToPdf(doc, 'Synopsis : ', synopsis);
};

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
  movePdfDocDown(doc, 0.5);
};

const createPdf = () => {
  const doc = new PDFDocument();

  return doc;
};

export { createPdf, pipePdf, generateSerieImage, generateNovelInfos };
