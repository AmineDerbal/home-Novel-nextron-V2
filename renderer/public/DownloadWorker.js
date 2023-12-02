import downlodaNovel from '../services/downloadNovel';

// type Novel = {
//   serieName: string,
//   serieLink: string,
//   serieImageSrc: string,
//   authorName: string,
//   authorLink: string,
//   lastUpdate: string,
//   synopsis: string,
//   chapters: Array<{ title: string, link: string, updateDate: string }>,
// };
// export default class DownloadWorker {
//   constructor() {
//     self.onmessage = this.handleMessage.bind(this);
//   }

//   private async downloadNovel(novel: Novel) {
//     return await downlodaNovel(novel);
//   }

//   private async handleMessage(event: MessageEvent) {
//     if (event.data === 'terminate') {
//       self.close();
//     } else {
//       const novel = event.data as Novel;
//       const response = await this.downloadNovel(novel);
//       self.postMessage(response);
//       self.close();
//     }
//   }
// }

self.onmessage = async (event) => {
  if (event.data === 'terminate') {
    self.close();
  } else {
    const novel = event.data;
    try {
      const response = await downlodaNovel(novel);
      self.postMessage(response);
    } catch (error) {
      self.postMessage(false);
    } finally {
      self.close();
    }
  }
};
