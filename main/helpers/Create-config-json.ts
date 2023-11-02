import fs from 'fs';

export default (configPath: string, defaultDownloadPath: string) => {
  const configData = {
    defaultDownloadPath,
    progress: {
      novelName: '',
      numberOfChapters: 0,
      currentChapter: 0,
      progress: 0,
    },
  };
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(configData));
  }
};
