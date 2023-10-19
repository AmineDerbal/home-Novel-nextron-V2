import fs from 'fs';

export default (configPath: string, defaultDownloadPath: string) => {
  const configData = {
    defaultDownloadPath,
  };
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(configData));
  }
};
