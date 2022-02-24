const fs = require("fs")
const os = require('os')
const path = require("path")
const { ipcRenderer } = require("electron")
import { lang, mainColor, tuberListContainer } from "./index.js"

const PROGRAM_VERSION = "1.4.0-stable"
const homeDir = os.homedir()
const rootPath = fs.readFileSync(path.resolve(homeDir, ".yf/path"), "utf8")
let settingPath = path.resolve(homeDir, ".yf/setting.json")
let defaultSetttingPath = path.resolve(homeDir, ".yf/defaultSetting.json")
let backupPath = path.resolve(homeDir, "Desktop/yf_backup.json")

const settingKr = ["새로고침 간격", "미리 불러오는 간격", "창의 가로크기", "창의 세로크기", "기본 배경색", "동시로딩갯수"]
const settingJp = ["更新遅延", "プリロード遅延", "ウィンドウ幅", "窓の高さ", "デフォルトの背景色", "同時ロード数"]
const settingEn = ["Refresh Delay", "Preload Delay", "Window Width", "Window Height", "Default Background Color", "Concurrent Loads"]

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
const backupCompletePopup = document.querySelector(".backupCompletePopup")
const showInfoImg = document.querySelector("#showInfoImg")
let settings = JSON.parse(fs.readFileSync(settingPath, "utf8"))

function showSetting() {
    while (settingPopupList.hasChildNodes()) {
        settingPopupList.removeChild(settingPopupList.firstChild)
    }
    let settingName
    let i = 0
    if (lang.includes("ko")) {settingName = settingKr}
    else if (lang.includes("jp")) {settingName = settingJp}
    else {settingName = settingEn}
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
        input.setAttribute("placeholder", info[2])
        input.value = info[0]
        div1.setAttribute("title", setting)
        div2.innerText = settingName[i]
        form.addEventListener("input", (event) => {
            event.preventDefault()
            if (input.value === "") {return null}
            settings[setting][0] = input.value
            saveSetting()
        })
        form.appendChild(input)
        div3.appendChild(form)
        div1.appendChild(div2)
        div1.appendChild(div3)
        settingPopupList.appendChild(div1)
        i++
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
    console.log("ALL RESET!")
    setTimeout(() => {location.reload()}, 500)
}

function backup() {
    const localStorageJson = localStorage["youtuber"]
    const json = {
        "localStorage": localStorageJson,
        "setting": JSON.stringify(settings)
    }
    fs.writeFileSync(backupPath, JSON.stringify(json))
    console.log("ALL BACKUP!")

    backupCompletePopup.style.display = "block"
    backupCompletePopup.classList.remove("hidePopup")
    backupCompletePopup.classList.add("showPopup")
    setTimeout(() => {
        backupCompletePopup.classList.remove("addPopup")
        backupCompletePopup.classList.add("hidePopup")
        setTimeout(() => {backupCompletePopup.style.display = "none"}, 250)
    }, 2000)
}

function showInfo() {
    ipcRenderer.invoke("showInfo")
}

const UpdateCheckPopup = document.querySelector(".UpdateCheckPopup")
const UpdateCheckPopupTitle = document.querySelector("#UpdateCheckPopupTitle")
const UpdateCheckPopupContent = document.querySelector("#UpdateCheckPopupContent")
const UpdateCheckPopupLink = document.querySelector("#UpdateCheckPopupLink")
function checkUpdate() {
    fetch("https://raw.githubusercontent.com/cottons-kr/YourFavorite/main/package.json").then(res => res.json())
    .then(data => {
        if (data["version"] == PROGRAM_VERSION) {
            if (lang.includes("ko")) {UpdateCheckPopupTitle.innerText = "최신버전을 쓰고있어요"}
            else if (lang.includes("jp")) {UpdateCheckPopupTitle.innerText = "最新バージョンを書いています。"}
            else {UpdateCheckPopupTitle.innerText = "You are using Lastest Version"}
            UpdateCheckPopupLink.style.display = "none"
        } else {
            if (lang.includes("ko")) {UpdateCheckPopupTitle.innerText = "새로운 버전이 있어요"}
            else if (lang.includes("jp")) {UpdateCheckPopupTitle.innerText = "新しいバージョンがあります。"}
            else {UpdateCheckPopupTitle.innerText = "There is a New Version"}
            UpdateCheckPopupLink.style.display = "block"
        }
        if (lang.includes("ko")) {UpdateCheckPopupContent.innerHTML = `현재 버전 : ${PROGRAM_VERSION }<br>최신 버전 : ${data["version"]}`}
        else if (lang.includes("jp")) {UpdateCheckPopupContent.innerHTML = `現行版 : ${PROGRAM_VERSION }<br>新バージョン : ${data["version"]}`}
        else {UpdateCheckPopupContent.innerHTML = `Current Version : ${PROGRAM_VERSION }<br>New Version: ${data["version"]}`}

        UpdateCheckPopupLink.style.backgroundColor = `rgba(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]}, 0.25)`
        UpdateCheckPopup.style.display = "block"
        UpdateCheckPopup.classList.remove("hidePopup")
        UpdateCheckPopup.classList.add("showPopup")
    })
}

settingButtonImg.addEventListener("mouseover", () => {
    settingButtonImg.style.opacity = 1
})
settingButtonImg.addEventListener("mouseout", () => {
    settingButtonImg.style.opacity = 0.1
})
settingButtonImg.addEventListener("click", () => {
    settingPopup.style.display = "block"
    tuberListContainer.style.pointerEvents = "none"
    settingPopup.classList.remove("hidePopup")
    settingPopup.classList.add("showPopup")
    showSetting()
    checkUpdate()
})
settingPopupExit.addEventListener("click", () => {
    tuberListContainer.style.pointerEvents = "all"
    settingPopup.classList.remove("addPopup")
    checkResetAllPopup.classList.remove("addPopup")
    backupCompletePopup.classList.remove("addPopup")
    UpdateCheckPopup.classList.remove("addPopup")
    UpdateCheckPopup.classList.add("hidePopup")
    settingPopup.classList.add("hidePopup")
    checkResetAllPopup.classList.add("hidePopup")
    backupCompletePopup.classList.add("hidePopup")
    setTimeout(() => {
        settingPopup.style.display = "none"
        checkResetAllPopup.style.display = "none"
        backupCompletePopup.style.display = "none"
        UpdateCheckPopup.style.display = "none"
    }, 250)
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
backupAllImg.addEventListener("click", backup)
showInfoImg.addEventListener("click", showInfo)