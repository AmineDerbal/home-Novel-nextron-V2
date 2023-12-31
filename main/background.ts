import { app, dialog, ipcMain, Menu } from 'electron';
import serve from 'electron-serve';
import path from 'path';
import { createWindow, CreateConfigJson, popupMenu } from './helpers';

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

  Menu.setApplicationMenu(null);

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    await CreateConfigJson(configPath, defaultDownloadPath);
    mainWindow.webContents.on('context-menu', () => {
      popupMenu.popup();
    });

    // Send the port number to the main window
    ipcMain.handle('get-port', () => {
      try {
        if (port) {
          return port;
        }
        return false;
      } catch (error) {
        return false;
      }
    });

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
        return result.filePaths[0];
      } catch (error) {
        throw error;
      }
    });
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
