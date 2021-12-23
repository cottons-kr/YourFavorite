const fs = require("fs")

let settingPath = "C:\\Users\\태영\\Desktop\\YourFavorite\\resource\\setting.js"
//let settingPath = "C:\\Program Files\\YourFavorite Preview\\resources\\app\\resource\\setting.js"
if (fs.existsSync(settingPath) == false) {
    settingPath = `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Programs\\YourFavorite Preview\\resources\\app\\resource\\setting.js`
}

let setting = fs.readFileSync(settingPath)