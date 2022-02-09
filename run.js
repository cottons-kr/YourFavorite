const { app, BrowserWindow } = require('electron')
const fs = require("fs")
const os = require('os')

const root = app.getAppPath("exe")
let settingPath = `${root}/resource/setting.json`
const settings = JSON.parse(fs.readFileSync(settingPath, "utf8"))

app.on("ready", () => {
    const win = new BrowserWindow({
        width: settings["windowWidth"][0],
        height: settings["windowHeight"][0],
        minWidth: 1461,
        minHeight: 792,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    win.setMenuBarVisibility(false)
    win.setAspectRatio(16/9)
    if (Intl.DateTimeFormat().resolvedOptions().locale.includes("ko")) {
        win.loadURL(`${root}/html/index.html`)
    } else {
        console.log(Intl.DateTimeFormat().resolvedOptions().locale)
        win.loadURL(`${root}/html/index-en.html`)
    }
    win.once("ready-to-show", () => {
        win.show()
    })
})
app.on("window-all-closed", () => {
    process.exit()
})