const { BrowserWindow, app } = require('electron')
require('./src/index.js')



function main() { // create 3 window now for testing
    for (i = 0; i < 3; i++) {
        let mainWindow = null
        mainWindow = new BrowserWindow()
        mainWindow.loadURL(`http://localhost:3000/`)
        mainWindow.on('close', event => {
          mainWindow = null
        })
      }
}

app.on('ready', main)