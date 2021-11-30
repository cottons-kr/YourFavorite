const express = require('express')
const { app, BrowserWindow } = require('electron');
const server = express()


server.get('/', function(req,res) {
    res.sendFile(__dirname + "/html/index.html")
})

server.get('/', function(req,res) {
    res.sendFile(__dirname + "/js/index.js")
    res.sendFile(__dirname + "/js/setting.js")
})

server.use(express.static(__dirname))
server.listen(9999)

app.on('ready', () => {
    const win = new BrowserWindow({
        width: 1920,
        minWidth: 800,
        height: 1080,
        minHeight: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    win.loadURL("http://127.0.0.1:9999")
    win.once("ready-to-show", () => {
        win.show()
    })
})
