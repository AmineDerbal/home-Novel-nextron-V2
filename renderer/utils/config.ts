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

export { getDefaultDownloadPath, updateDefaultDownloadPath };
