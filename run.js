const express = require('express')
const { app, BrowserWindow } = require('electron')
const server = express()

server.get('/', (req,res) => {
    res.sendFile(__dirname + "/html/index.html")
})
server.get('/', (req,res) => {
    res.sendFile(__dirname + "/js/index.js")
})
server.get('/', (req,res) => {
    res.sendFile(__dirname + "/js/setting.js")
})

server.use(express.static(__dirname))
server.listen(21112)

function show() {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    win.setMenuBarVisibility(false)
    win.loadURL("http://127.0.0.1:21112")
    win.show()
}

app.on("ready", () => {
    setTimeout(show, 1000)
})
