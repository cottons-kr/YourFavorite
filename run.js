const { app, BrowserWindow } = require('electron');

function createWindow () {
  let win = new BrowserWindow({
    width: 1920,
    height: 1080,
    /*frame: false,*/
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadFile('html/index.html')
  /*win.setMenu(null)*/
}

app.on('ready', createWindow);