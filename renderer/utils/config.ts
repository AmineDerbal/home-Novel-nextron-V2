import path from 'path';
import fs from 'fs';

const getConfigJsonPath = () => path.join(process.cwd(), 'config.json');

const getDownloadData = async () => {
  const configJsonPath = getConfigJsonPath();
  try {
    const data = await fs.promises.readFile(configJsonPath);
    const jsonData = JSON.parse(data.toString());
    return jsonData;
  } catch (err) {
    console.error('Error getting download data:', err);
    return null;
  }
};
const getDefaultDownloadPath = async () => {
  try {
    const jsonData = await getDownloadData();
    if (!jsonData) {
      return { success: false };
    }
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

const getDownloadProgress = async () => {
  const configJsonPath = getConfigJsonPath();
  try {
    const data = await fs.promises.readFile(configJsonPath);
    const jsonData = JSON.parse(data.toString());
    const progress = jsonData.progress;
    if (progress) {
      return {
        success: true,
        progress,
      };
    }
    return {
      success: false,
    };
  } catch (err) {
    console.error('Error getting download progress:', err);
    return { success: false };
  }
};

const updateDefaultDownloadPath = async (defaultDownloadPath: string) => {
  const configJsonPath = getConfigJsonPath();
  try {
    const jsonData = await getDownloadData();
    if (!jsonData) {
      return false;
    }
    jsonData.defaultDownloadPath = defaultDownloadPath;
    await fs.promises.writeFile(configJsonPath, JSON.stringify(jsonData));
    return true;
  } catch (err) {
    console.error('Error updating default download path:', err);
    return false;
  }
};

const updateDownloadProgress = async ({
  novelName,
  numberOfChapters,
  currentChapter,
  progress,
}: {
  novelName: string;
  numberOfChapters: number;
  currentChapter: number;
  progress: number;
}) => {
  const configJsonPath = getConfigJsonPath();
  try {
    const jsonData = await getDownloadData();
    if (!jsonData) {
      return false;
    }
    jsonData.progress = {
      novelName,
      numberOfChapters,
      currentChapter,
      progress,
    };
    await fs.promises.writeFile(configJsonPath, JSON.stringify(jsonData));
    return true;
  } catch (err) {
    console.error('Error updating download progress:', err);
    return false;
  }
};

export {
  getDefaultDownloadPath,
  updateDefaultDownloadPath,
  getDownloadProgress,
  updateDownloadProgress,
};
