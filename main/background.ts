import { app, dialog, ipcMain } from 'electron';
import serve from 'electron-serve';
import path from 'path';
import { createWindow, CreateConfigJson } from './helpers';

const configPath = path.join(process.cwd(), 'config.json'); // Create the defualt Json config file
const defaultDownloadPath = path.join(process.env.USERPROFILE, 'downloads'); // The defualt download path

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    console.log(`Listening on http://localhost:${port}`);
    console.log(configPath);
    await CreateConfigJson(configPath, defaultDownloadPath);

    // Open the directory dialog and return the selected directory
    ipcMain.handle('open-directory-dialog', async (options: any) => {
      try {
        const result = await dialog.showOpenDialog(mainWindow, {
          properties: ['openDirectory'],
          defaultPath: options.defaultPath,
        });
        if (result.canceled) {
          return null;
        }
        console.log('result', result);
        return result.filePaths[0];
      } catch (error) {
        throw error;
      }
    });

    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
