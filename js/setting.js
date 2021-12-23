const fs = require("fs")
const os = require('os')

let settingPath = "C:\\Users\\태영\\Desktop\\YourFavorite\\resource\\setting.json"
//let settingPath = "C:\\Program Files\\YourFavorite Preview\\resources\\app\\resource\\setting.json"
if (fs.existsSync(settingPath) == false) {
    settingPath = `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Programs\\YourFavorite Preview\\resources\\app\\resource\\setting.json`
}

const settingButtonImg = document.querySelector("#settingButtonImg")
const settingPopupExit = document.querySelector("#settingPopupExit")
const settingPopup = document.querySelector(".settingPopup")
let setting = JSON.parse(fs.readFileSync(settingPath, "utf8"))


settingButtonImg.addEventListener("mouseover", () => {
    settingButtonImg.style.opacity = 1
})
settingButtonImg.addEventListener("mouseout", () => {
    settingButtonImg.style.opacity = 0.1
})
settingButtonImg.addEventListener("click", () => {
    settingPopup.style.display = "block"
    settingPopup.classList.remove("hidePopup")
    settingPopup.classList.add("showPopup")
})
settingPopupExit.addEventListener("click", () => {
    settingPopup.classList.remove("addPopup")
    settingPopup.classList.add("hidePopup")
    setTimeout(() => {settingPopup.style.display = "none"}, 250)
})