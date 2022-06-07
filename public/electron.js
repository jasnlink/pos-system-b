/********************************************************************************************************
 * 
 * Initialize Electron base
 * 
********************************************************************************************************/

//if electron is in development mode, disable before building
const isDev = true;

const { 
  app, 
  BrowserWindow, 
  ipcMain 
} = require('electron');

const path = require('path');
const fs = require("fs");

const sqlite = require('sqlite');

const database = new sqlite.Database('./public/store.sqlite3', (err) => {
    if (err) console.error('Database opening error: ', err);
});


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    useContentSize: true,
    webPreferences: {
      defaultFontFamily: 'sansSerif',
      nodeIntegration: false, // is default value after Electron v5
      webSecurity: true,
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js") // use a preload script
    },
    resizable: false,
    alwaysOnTop: false,
    minimizable: true,
    frame: true,
    fullscreen: false,
    //titleBarStyle: 'hidden'
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});




/********************************************************************************************************
 * 
 * Write/Read Operations
 * 
********************************************************************************************************/

// Receive async message from renderer
// See file renderer.js on line 3
ipcMain.on('toMain', (event, data) => {
  // It's so good because below have a delay 5s to execute, and this don't lock rendereder :)
    console.log(data)
    // Send reply to a renderer
    if(data === 'ping') {
      win.webContents.send('fromMain', 'pong')
    }
})