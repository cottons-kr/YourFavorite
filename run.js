const { app, BrowserWindow } = require('electron')
const fs = require("fs")
const os = require('os')
const path = require("path")

const defaultSetting = {
    "autoReloadDelay":[5000,"새로고침 간격","ms","number"],
    "preloadDelay":[5000,"미리 불러오는 간격","ms","number"],
    "windowWidth":[1920,"창의 가로크기","숫자","number"],
    "windowHeight":[1080,"창의 세로크기","숫자","number"],
    "defaultBackground":["true","기본 배경색","true/false","boolean"],
    "simultaneousLoadNumber":["3","동시로딩갯수","숫자","number"]
}

const homeDir = os.homedir()
const settingPath = path.resolve(homeDir, ".yf/setting.json")
if (!fs.existsSync(settingPath)) {
    fs.mkdirSync(path.resolve(homeDir, ".yf"))
    fs.writeFileSync(settingPath, JSON.stringify(defaultSetting), "utf8")
    fs.writeFileSync(path.resolve(homeDir, ".yf/defaultSetting.json"), JSON.stringify(defaultSetting), "utf8")
    fs.writeFileSync(path.resolve(homeDir, ".yf/path"), homeDir, "utf8")
}
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
        win.loadFile("index.html")
    } else {
        console.log(Intl.DateTimeFormat().resolvedOptions().locale)
        win.loadFile(`index-en.html`)
    }
    win.show()
})
app.on("window-all-closed", () => {
    process.exit()
})