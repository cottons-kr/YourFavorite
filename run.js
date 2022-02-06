const { app, BrowserWindow } = require('electron')
const fs = require("fs")
const os = require('os')

const root = app.getAppPath("exe")
fs.writeFileSync(`${root}/js/path`, root)
fs.writeFileSync(`${root}/path`, root)
let settingPath = `${root}/resource/setting.json`
const settings = JSON.parse(fs.readFileSync(settingPath, "utf8"))

function show() {
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
    win.show()
}

app.on("ready", () => {
    setTimeout(show, 1000)
})
app.on("window-all-closed", () => {
    app.exit()
})