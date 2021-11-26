const { app, BrowserWindow } = require('electron');

function createWindow () {
  let win = new BrowserWindow({
    width: 1600,
    height: 900,
    /*frame: false,*/
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadFile('html/index.html')
  win.setMenu(null)
}

app.on('ready', createWindow);