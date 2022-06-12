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


/********************************************************************************************************
 * Clients
********************************************************************************************************/

//fetch all clients selected table in database
ipcMain.handle('list-client', async (event, data) => {

  const tableId = data.tableId

  console.log('fetching all clients...')

  const query = 'SELECT * FROM pos_clients WHERE table_id=? ORDER BY client_number ASC'
  database.all(query, tableId, function (err, rows) {
    if (err) {
      return console.log(err)
    }
      return mainWindow.webContents.send('list-client', rows)
  })

})

//creates first client for new table
ipcMain.handle('new-table-client', async (event, data) => {

  const tableId = data.tableId

  console.log('creating first client for table id...', tableId)

  const query = 'INSERT INTO pos_clients (client_number, table_id) VALUES (1, ?)'
  database.run(query, tableId, function (err) {
    if (err) {
      return console.log(err)
    }

      //using this object because its the only way it works...
      const lastInsertId = this.lastID
      console.log('fetching newly created client...', lastInsertId)

      const query = 'SELECT * FROM pos_clients WHERE client_id=?'
      database.get(query, lastInsertId, function (err, row) {
        if (err) {
          return console.log(err)
        }
        return mainWindow.webContents.send('new-table-client', row)
      })

  })

})


/********************************************************************************************************
 * Tables
********************************************************************************************************/

//fetch all tables in database
ipcMain.handle('list-table', async (event, data) => {

  console.log('fetching all tables...')

  const query = 'SELECT * FROM pos_tables ORDER BY table_number ASC'
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

  const query = 'SELECT * FROM pos_tables WHERE table_number=? ORDER BY table_number ASC'
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
      const query = 'SELECT * FROM pos_tables WHERE table_id=? ORDER BY table_number ASC'
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
 * Categories
********************************************************************************************************/

//fetch all categories in database
ipcMain.handle('list-category', async (event, data) => {

  console.log('fetching all categories...')

  const query = 'SELECT * FROM pos_categories ORDER BY category_sort_id ASC'
  database.all(query, function (err, rows) {
    if (err) {
      return console.log(err)
    }
      return mainWindow.webContents.send('list-category', rows)
  })

})

/********************************************************************************************************
 * Items
********************************************************************************************************/

//fetch all items in selected categories in database
ipcMain.handle('list-item', async (event, data) => {

  const categoryId = data.categoryId

  console.log('fetching all items in category...', categoryId)

  const query = 'SELECT * FROM pos_items WHERE category_id=? ORDER BY item_sort_id ASC'
  database.all(query, categoryId, function (err, rows) {
    if (err) {
      return console.log(err)
    }
      return mainWindow.webContents.send('list-item', rows)
  })

})


/********************************************************************************************************
 * Orders
********************************************************************************************************/

//fetch order and its line items given a table and client id
ipcMain.handle('fetch-order', async (event, data) => {

  const tableId = data.tableId
  const clientId = data.clientId

  console.log('fetching order for table...', tableId, 'client...', clientId)

  const query = 'SELECT * FROM pos_orders WHERE table_id=? AND client_id=?'
  database.get(query, [tableId, clientId], function (err, row) {
    if (err) {
      return console.log(err)
    }

    let order;

    //order found, fetch line items
    if(row) {

      order = row

      console.log('order found, fetching line items...', order.order_id)

      const query = 'SELECT pos_order_lines.*, pos_items.item_name, pos_items.item_price FROM pos_order_lines INNER JOIN pos_items ON pos_order_lines.item_id = pos_items.item_id WHERE order_id=?'
      database.all(query, order.order_id, function (err, rows) {
        if (err) {
          return console.log(err)
        }
          //populate line items in order
          order['line_items'] = rows
          return mainWindow.webContents.send('fetch-order', order)
      })
    }

    //order not found, initialize new order 
    else if(row === undefined) {
      const query = 'INSERT INTO pos_orders (order_type, last_updated, created_on, table_id, client_id) VALUES ("dine_in", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?)'
      database.run(query, [tableId, clientId], function (err) {
        if (err) {
          return console.log(err)
        }

        //using this object because its the only way it works...
        const lastInsertId = this.lastID
        console.log('order not found, creating new order with id...', lastInsertId)


        //order is created, fetch new order info
        const query = 'SELECT * FROM pos_orders WHERE order_id=?'
        database.get(query, lastInsertId, function (err, row) {
          if (err) {
            return console.log(err)
          }

          order = row
          order['line_items'] = []

          return mainWindow.webContents.send('fetch-order', order)

        })

      })
    }
  })

})


//add line item to selected order
ipcMain.handle('add-item-order', async (event, data) => {

  const orderId = data.orderId
  const item = data.item

  console.log('inserting item into order...', orderId)

  //insert new order line
  const query = 'INSERT INTO pos_order_lines (order_id, item_id, subtotal) VALUES (?, ?, ?)'
  database.run(query, [orderId, item.item_id, item.item_price], function (err) {
    if (err) {
      return console.log(err)
    }

    console.log('updating order totals...')

    //get old order subtotal
    const query = 'SELECT order_subtotal FROM pos_orders WHERE order_id=?'
    database.get(query, orderId, function (err, row) {
      if (err) {
        return console.log(err)
      }

      //get subtotal and calculate new taxes and totals
      let subtotal = row.order_subtotal

      subtotal += item.item_price

      let tps = Math.round(subtotal*0.05)
      let tvq = Math.round(subtotal*0.09975)
      let total = subtotal+tps+tvq

      //update order totals
      const query = 'UPDATE pos_orders SET order_subtotal=?, order_tps=?, order_tvq=?, order_total=? WHERE order_id=?'
      database.run(query, [subtotal, tps, tvq, total, orderId], function (err) {
        if (err) {
          return console.log(err)
        }

        console.log('fetching updated order...')

        //fetch updated order
        const query = 'SELECT * FROM pos_orders WHERE order_id=?'
        database.get(query, orderId, function (err, row) {
          if (err) {
            return console.log(err)
          }

          let order = row
          

          //fetch order line items
          const query = 'SELECT pos_order_lines.*, pos_items.item_name, pos_items.item_price FROM pos_order_lines INNER JOIN pos_items ON pos_order_lines.item_id = pos_items.item_id WHERE order_id=?'
          database.all(query, orderId, function (err, rows) {
            if (err) {
              return console.log(err)
            }
              //populate line items in order
              order['line_items'] = rows
              return mainWindow.webContents.send('add-item-order', order)
          })


        })

      })


    })

  })

})


//remove line item to selected order
ipcMain.handle('remove-item-order', async (event, data) => {

  const orderId = data.orderId
  const line = data.line

  console.log('removing item into order...', orderId)

  //insert new order line
  const query = 'DELETE FROM pos_order_lines WHERE order_line_id=?'
  database.run(query, line.order_line_id, function (err) {
    if (err) {
      return console.log(err)
    }

    console.log('updating order totals...')

    //get old order subtotal
    const query = 'SELECT order_subtotal FROM pos_orders WHERE order_id=?'
    database.get(query, orderId, function (err, row) {
      if (err) {
        return console.log(err)
      }

      //get subtotal and calculate new taxes and totals
      let subtotal = row.order_subtotal

      subtotal -= line.subtotal

      let tps = Math.round(subtotal*0.05)
      let tvq = Math.round(subtotal*0.09975)
      let total = subtotal+tps+tvq

      //update order totals
      const query = 'UPDATE pos_orders SET order_subtotal=?, order_tps=?, order_tvq=?, order_total=? WHERE order_id=?'
      database.run(query, [subtotal, tps, tvq, total, orderId], function (err) {
        if (err) {
          return console.log(err)
        }

        console.log('fetching updated order...')

        //fetch updated order
        const query = 'SELECT * FROM pos_orders WHERE order_id=?'
        database.get(query, orderId, function (err, row) {
          if (err) {
            return console.log(err)
          }

          let order = row
          

          //fetch order line items
          const query = 'SELECT pos_order_lines.*, pos_items.item_name, pos_items.item_price FROM pos_order_lines INNER JOIN pos_items ON pos_order_lines.item_id = pos_items.item_id WHERE order_id=?'
          database.all(query, orderId, function (err, rows) {
            if (err) {
              return console.log(err)
            }
              //populate line items in order
              order['line_items'] = rows
              return mainWindow.webContents.send('remove-item-order', order)
          })


        })

      })


    })

  })

})


/********************************************************************************************************
 * Settings
********************************************************************************************************/

//fetch 4 digit security pin FROM database
ipcMain.handle('fetch-security-pin', async (event, data) => {

  console.log('fetching security pin...')

  const query = 'SELECT security_pin FROM pos_settings'
  database.get(query, function (err, row) {
    if (err) {
      return console.log(err)
    }

    return mainWindow.webContents.send('fetch-security-pin', row)
  })

})