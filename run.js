const express = require('express')
const { app, BrowserWindow } = require('electron');
const server = express()


server.get('/', function(req,res) {
    res.sendFile(__dirname + "/html/index.html")
    res.sendFile(__dirname + "/js/index.js")
    res.sendFile(__dirname + "/js/setting.js")
    res.sendFile(__dirname + "/getInfo.py")
})

server.use(express.static(__dirname))
server.listen(9999)

app.on('ready', () => {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    win.setMenuBarVisibility(false)
    win.loadURL("http://127.0.0.1:9999")
    win.once("ready-to-show", () => {
        win.show()
    })
})
