import path from 'path';
import fs from 'fs';
import { ipcRenderer } from 'electron';

const getConfigJsonPath = () => path.join(process.cwd(), 'config.json');

const getPortfromMain = async () => {
  try {
    const port = await ipcRenderer.invoke('get-port');
    if (port) {
      return port;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const getHomeUrl = async () => {
  let port: string | boolean = false;
  while (!port) {
    port = await getPortfromMain();
  }
  return `http://localhost:${port}/`;
};

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

const getBrowserPid = async () => {
  const configJsonPath = getConfigJsonPath();
  try {
    const data = await fs.promises.readFile(configJsonPath);
    const jsonData = JSON.parse(data.toString());
    const browserPid = jsonData.browserPid;
    return {
      success: true,
      browserPid,
    };
  } catch (err) {
    console.error('Error getting browser pid:', err);
    return { success: false };
  }
};

const setBrowserPid = async (pid: number) => {
  const configJsonPath = getConfigJsonPath();
  try {
    const jsonData = await getDownloadData();
    if (!jsonData) {
      return { success: false };
    }
    jsonData.browserPid = pid;
    await fs.promises.writeFile(configJsonPath, JSON.stringify(jsonData));
    return {
      success: true,
    };
  } catch (err) {
    console.error('Error setting browser pid:', err);
    return { success: false };
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
  getBrowserPid,
  setBrowserPid,
  getHomeUrl,
};
