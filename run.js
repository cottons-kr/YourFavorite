const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const fs = require("fs")
const os = require('os')
const path = require("path")
const commandExist = require("command-exists")

const PROGRAM_VERSION  = "1.1.0",
      NODE_VERSION     = process.versions.node,
      ELECTRON_VERSION = process.versions.electron,
      V8_VERSION       = process.versions.v8,
      CHROME_VERSION   = process.versions.chrome,
      OS_VERSION       = `${os.type()} ${os.release()}`

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
}
fs.writeFileSync(settingPath, JSON.stringify(defaultSetting), "utf8")
fs.writeFileSync(path.resolve(homeDir, ".yf/defaultSetting.json"), JSON.stringify(defaultSetting), "utf8")
fs.writeFileSync(path.resolve(homeDir, ".yf/path"), homeDir, "utf8")
const settings = JSON.parse(fs.readFileSync(settingPath, "utf8"))

if (fs.existsSync("getInfo.py")) {
    const data = `const fileContent = \`${fs.readFileSync("getInfo.py", "utf8")}\`; export default fileContent`
    fs.writeFileSync("js/getInfo.py.js", data, "utf8")
}

if (OS_VERSION.includes("NT")) {
    commandExist("python", (err, result) => {
        if (!result) {
            dialog.showErrorBox("Python을 설치해주세요!", "혹은 Python이 PATH에 등록되지 않은걸수도 있어요")
            process.exit()
        }
    })
} else {
    commandExist("python3", (err, result) => {
        if (!result) {
            dialog.showErrorBox("Python을 설치해주세요!", "혹은 Python이 PATH에 등록되지 않은걸수도 있어요")
            process.exit()
        }
    })
}
commandExist("pip3", (err, result) => {
    if (!result) {
        dialog.showErrorBox("PIP3가 감지되지 않았습니다!", "혹은 PIP가 PATH에 등록되지 않은걸수도 있어요")
        process.exit()
    }
})
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
OS : ${OS_VERSION}

오류 발생시 이 창을 캡처해 올려주세요 :)`
        dialog.showMessageBox(win, { type: "info", message: "YourFavorite 정보", detail: text, buttons: ["ok"]})
    })
    win.show()
})
app.on("window-all-closed", () => {
    process.exit()
})