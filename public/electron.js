/********************************************************************************************************
 * 
 * Initialize sqlite store
 * with npm SQLite@5.0.8
 * 
********************************************************************************************************/

const sqlite3 = require('sqlite3').verbose();

const database = new sqlite3.cached.Database('./store.sqlite3', (err) => {
    if (err) console.error('Database opening error: ', err);
});



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
 * Database Operations
 * 
********************************************************************************************************/

//fetch all tables in database
ipcMain.handle('list-table', async (event, data) => {

  console.log('fetching all tables...')

  const query = 'SELECT * from pos_tables ORDER BY table_number ASC'
  database.all(query, function (err, rows) {
    if (err) {
      return console.log(err)
    }
      return mainWindow.webContents.send('list-table', rows)
  })

})


//looks for table number in the database,
//if it cant be found, then it creates a new table
ipcMain.handle('fetch-table', async (event, data) => {

  const number = data.number

  console.log('fetching table by number...', number)

  const query = 'SELECT * from pos_tables WHERE table_number=? ORDER BY table_number ASC'
  database.get(query, number, function (err, row) {
    if (err) {
      return console.log(err)
    }

    //found matching table, send table data over
    if (row) {
      return mainWindow.webContents.send('fetch-table', row)
    }

    //table not found, create new table
    const query = 'INSERT INTO pos_tables (table_number) VALUES (?)'
    database.run(query, number, function (err) {
      if (err) {
        return console.log(err)
      }

      //using this object because its the only way it works...
      const lastInsertId = this.lastID
      console.log('table not found, creating new table with id...', lastInsertId)


      //table is created, fetch new table info
      const query = 'SELECT * from pos_tables WHERE table_id=? ORDER BY table_number ASC'
      database.get(query, lastInsertId, function (err, row) {
        if (err) {
          return console.log(err)
        }

        return mainWindow.webContents.send('fetch-table', row)

      })
 
    })
     
  })
  
  
})

/********************************************************************************************************
 * Settings
********************************************************************************************************/

//fetch 4 digit security pin from database
ipcMain.handle('fetch-security-pin', async (event, data) => {

  console.log('fetching security pin...')

  const query = 'SELECT security_pin from pos_settings'
  database.get(query, function (err, row) {
    if (err) {
      return console.log(err)
    }

    return mainWindow.webContents.send('fetch-security-pin', row)
  })

})