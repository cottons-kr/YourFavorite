const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const { execSync } = require("child_process")
const fs = require("fs")
const os = require('os')
const path = require("path")
const commandExist = require("command-exists")

const PROGRAM_VERSION  = "1.4.0-stable",
            NODE_VERSION     = process.versions.node,
            ELECTRON_VERSION = process.versions.electron,
            V8_VERSION       = process.versions.v8,
            CHROME_VERSION   = process.versions.chrome,
            OS_VERSION       = `${os.type()} ${os.release()}`

const argLang = app.commandLine.getSwitchValue("lang")
let lang  = Intl.DateTimeFormat().resolvedOptions().locale
const defaultSetting = {
    "autoReloadDelay":[60000,"ms","number"],
    "preloadDelay":[180000,"ms","number"],
    "windowWidth":[1920,"Number","number"],
    "windowHeight":[1080,"Number","number"],
    "defaultBackground":[false,"true/false","boolean"],
    "simultaneousLoadNumber":[3,"Number","number"]
}

if (argLang != "") {
    lang = argLang
}

const homeDir = os.homedir()
const settingPath = path.resolve(homeDir, ".yf/setting.json")

if (!fs.existsSync(settingPath)) {
    fs.mkdirSync(path.resolve(homeDir, ".yf"))
    fs.writeFileSync(settingPath, JSON.stringify(defaultSetting), "utf8")
    execSync("pip3 install selenium==4.1.0 webdriver-manager")
    execSync("pip3 install --upgrade pip requests")
}
fs.writeFileSync(path.resolve(homeDir, ".yf/defaultSetting.json"), JSON.stringify(defaultSetting), "utf8")
fs.writeFileSync(path.resolve(homeDir, ".yf/path"), homeDir, "utf8")
fs.writeFileSync(path.resolve(homeDir, ".yf/lang"), lang, "utf8")
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

    if (argLang != "") {
        if (argLang == "ko") {win.loadFile("index.html")}
        else if (argLang == "jp") {win.loadFile("index-jp.html")}
        else {win.loadFile(`index-en.html`)}
    } else {
        if (Intl.DateTimeFormat().resolvedOptions().locale.includes("ko")) {win.loadFile("index.html")}
        else if (Intl.DateTimeFormat().resolvedOptions().locale.includes("ja")) {win.loadFile("index-jp.html")}
        else {win.loadFile(`index-en.html`)}
    }
    ipcMain.handle("showMessage", (err, title, msg, type="info") => {
        if (type == "error") {
            dialog.showErrorBox(title, msg)
        }
        else {
            dialog.showMessageBox(win, { type: type, message: title, detail: msg, buttons: ["ok"]})
        }
    })
    ipcMain.handle("showInfo", (err) => {
        const text = `
YourFavorite ${PROGRAM_VERSION}
nodejs : ${NODE_VERSION}
Electron : ${ELECTRON_VERSION}
V8 : ${V8_VERSION}
Chromium : ${CHROME_VERSION}
OS : ${OS_VERSION}`
        dialog.showMessageBox(win, { type: "info", message: "YourFavorite By SerenDev", detail: text, buttons: ["ok"]})
    })
    win.show()
})
app.on("window-all-closed", () => {
    process.exit()
})