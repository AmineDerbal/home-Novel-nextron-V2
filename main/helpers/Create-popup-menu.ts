import { Menu } from 'electron';

const contextMenuTemplate = [
  {
    label: 'Copy',
    role: 'copy',
  } as Electron.MenuItemConstructorOptions,
  {
    label: 'Paste',
    role: 'paste',
  } as Electron.MenuItemConstructorOptions,
];

const popupMenu = Menu.buildFromTemplate(contextMenuTemplate);

export default popupMenu;
