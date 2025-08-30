
import { app as electronApp, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { ensureDb, addItem, listItems } from './db';

let mainWin: BrowserWindow | null = null;

function getIndexHtml() {
  return path.join(__dirname, '..', 'dist', 'index.html');
}

async function createWindow() {
  await ensureDb();

  mainWin = new BrowserWindow({
    width: 1100,
    height: 720,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  await mainWin.loadFile(getIndexHtml());
  mainWin.on('closed', () => (mainWin = null));
}

electronApp.whenReady().then(createWindow);

electronApp.on('window-all-closed', () => {
  if (process.platform !== 'darwin') electronApp.quit();
});

electronApp.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.handle('items:add', (_e, data: { name: string; price: number; stock: number }) => addItem(data.name, data.price, data.stock));
ipcMain.handle('items:list', () => listItems());
