import downlodaNovel from '../services/downloadNovel';

type Novel = {
  serieName: string;
  serieLink: string;
  serieImageSrc: string;
  authorName: string;
  authorLink: string;
  lastUpdate: string;
  synopsis: string;
  chapters: Array<{ title: string; link: string; updateDate: string }>;
};

let terminateFlag = false;

self.onmessage = async (event: MessageEvent) => {
  if (event.data === 'terminate') {
    terminateFlag = true;
    self.postMessage(false);
    self.close();
  } else {
    const novel: Novel = event.data;
    try {
      const response = await downlodaNovel(novel);

      // Check the termination flag before posting the response
      if (!terminateFlag) {
        self.postMessage(response);
      }
    } catch (error) {
      // Check the termination flag before posting the error
      if (!terminateFlag) {
        self.postMessage(false);
      }
    } finally {
      // Close the worker only if the termination flag is not set
      if (!terminateFlag) {
        self.close();
      }
    }
  }
};
