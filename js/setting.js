const fs = require("fs")
const os = require('os')

let settingPath = "C:\\Users\\태영\\Desktop\\YourFavorite\\resource\\setting.json"
let defaultSetttingPath = "C:\\Users\\태영\\Desktop\\YourFavorite\\resource\\defaultSetting.json"
let backupPath = "C:\\Users\\태영\\Desktop\\YourFavorite\\resource\\backup.json"

//let settingPath = "C:\\Program Files\\YourFavorite Preview\\resources\\app\\resource\\setting.json"
//let defaultSettingPath = "C:\\Program Files\\YourFavorite Preview\\resources\\app\\resource\\defaultSetting.json"
//let backupPath = "C:\\Program Files\\YourFavorite Preview\\resources\\app\\resource\\backup.json"
if (fs.existsSync(settingPath) == false) {
    settingPath = `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Programs\\YourFavorite Preview\\resources\\app\\resource\\setting.json`
    defaultSetttingPath = `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Programs\\YourFavorite Preview\\resources\\app\\resource\\defaultSetting.json`
    backupPath = `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Programs\\YourFavorite Preview\\resources\\app\\resource\\backup.json`
}

const settingButtonImg = document.querySelector("#settingButtonImg")
const settingPopupExit = document.querySelector("#settingPopupExit")
const settingPopup = document.querySelector(".settingPopup")
const settingPopupList = document.querySelector("#settingPopupList")
const resetSettingImg = document.querySelector("#resetSettingImg")
const resetAllImg = document.querySelector("#resetAllImg")
const checkResetAllPopup = document.querySelector(".checkResetAllPopup")
const checkResetAllPopupYes = document.querySelector("#checkResetAllPopupYes")
const checkResetAllPopupNo = document.querySelector("#checkResetAllPopupNo")
const backupAllImg = document.querySelector("#backupAllImg")
let settings = JSON.parse(fs.readFileSync(settingPath, "utf8"))

function showSetting() {
    while (settingPopupList.hasChildNodes()) {
        settingPopupList.removeChild(settingPopupList.firstChild)
    }
    for (let setting of Object.keys(settings)) {
        const info = settings[setting]
        const div1 = document.createElement("div")
        const div2 = document.createElement("div")
        const div3 = document.createElement("div")
        const form = document.createElement("form")
        const input = document.createElement("input")
        div1.setAttribute("id", "setting")
        div2.setAttribute("id", "settingTitle")
        div3.setAttribute("id", "settingInput")
        input.setAttribute("type", info[3])
        input.setAttribute("placeholder", `단위는 ${info[2]} 입니다`)
        input.value = info[0]
        div1.setAttribute("title", setting)
        div2.innerText = info[1]
        form.addEventListener("input", (event) => {
            event.preventDefault()
            if (input.value === "") {return null}
            settings[setting][0] = parseInt(input.value)
            saveSetting()
        })
        form.appendChild(input)
        div3.appendChild(form)
        div1.appendChild(div2)
        div1.appendChild(div3)
        settingPopupList.appendChild(div1)
    }
}

function saveSetting() {
    fs.writeFileSync(settingPath, JSON.stringify(settings))
}

function resetSetting() {
    fs.writeFileSync(settingPath, fs.readFileSync(defaultSetttingPath, "utf8"))
    console.log("Setting Reseted")
    setTimeout(() => {location.reload()}, 500)
}

function resetAll() {
    localStorage.clear()
    fs.writeFileSync(settingPath, fs.readFileSync(defaultSetttingPath, "utf8"))
    console.log("All REEST!")
    setTimeout(() => {location.reload()}, 500)
}

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
    showSetting()
})
settingPopupExit.addEventListener("click", () => {
    settingPopup.classList.remove("addPopup")
    checkResetAllPopup.classList.remove("addPopup")
    settingPopup.classList.add("hidePopup")
    checkResetAllPopup.classList.add("hidePopup")
    setTimeout(() => {settingPopup.style.display = "none"}, 250)
    setTimeout(() => {checkResetAllPopup.style.display = "none"}, 250)
})
resetSettingImg.addEventListener("click", resetSetting)
resetAllImg.addEventListener("click", () => {
    checkResetAllPopup.style.display = "block"
    checkResetAllPopup.classList.remove("hidePopup")
    checkResetAllPopup.classList.add("showPopup")
})
checkResetAllPopupYes.addEventListener("click", resetAll)
checkResetAllPopupNo.addEventListener("click", () => {
    checkResetAllPopup.classList.remove("addPopup")
    checkResetAllPopup.classList.add("hidePopup")
    setTimeout(() => {checkResetAllPopup.style.display = "none"}, 250)
})
