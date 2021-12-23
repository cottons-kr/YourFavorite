const { app, BrowserWindow } = require('electron')
const fs = require("fs")
const os = require('os')

let settingPath = "C:\\Users\\태영\\Desktop\\YourFavorite\\resource\\setting.json"
//let settingPath = "C:\\Program Files\\YourFavorite Preview\\resources\\app\\resource\\setting.json"
if (fs.existsSync(settingPath) == false) {
    settingPath = `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Programs\\YourFavorite Preview\\resources\\app\\resource\\setting.json`
}
const settings = JSON.parse(fs.readFileSync(settingPath, "utf8"))

function show() {
    const win = new BrowserWindow({
        width: settings["windowWidth"][0],
        height: settings["windowHeight"][0],
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