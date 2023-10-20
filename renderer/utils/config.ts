import path from 'path';
import fs from 'fs';

const getConfigJsonPath = () => path.join(process.cwd(), 'config.json');
const getDefaultDownloadPath = async (configJsonPath: string) => {
  try {
    const data = await fs.promises.readFile(configJsonPath);
    const jsonData = JSON.parse(data.toString());
    const defaultDownloadPath = jsonData.defaultDownloadPath;
    return {
      success: true,
      defaultDownloadPath,
    };
  } catch (err) {
    console.error('Error getting default download path:', err);
    return { success: false };
  }
};

export { getConfigJsonPath, getDefaultDownloadPath };
