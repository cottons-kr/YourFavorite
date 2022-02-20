const { ipcRenderer } = require("electron")
import { removeTuber, loadList, tuberListContainer, lang, mainColor } from "./index.js"

const url  = "https://raw.githubusercontent.com/cottons-kr/yf-archive/main/"

function handleError(msg) {
    console.log(msg)
    if (lang.includes("ko")) {ipcRenderer.invoke("showMessage", "패키지 오류!", "올바른 형식의 패키지가 아니에요", "warning")}
    else if (lang.includes("jp")) {ipcRenderer.invoke("showMessage", "パッケージエラー!", "正しい形式のパッケージではありません。", "warning")}
    else {ipcRenderer.invoke("showMessage", "Package Error!", "This Package is not in the correct format", "warning")}
}

const packageInfoPopupAddBtn = document.querySelector("#packageInfoPopupAddBtn")

let selectedPackage, loadingPackage
const packageInfoPopup = document.querySelector(".packageInfoPopup")
const packageInfoPopupTitle = document.querySelector("#packageInfoPopupTitle")
const packageInfoPopupMadeby = document.querySelector("#packageInfoPopupMadeby")
const packageInfoPopupAbout = document.querySelector("#packageInfoPopupAbout")
const packageInfoPopupContentList = document.querySelector("#packageInfoPopupContentList")
function loadPackageInfo(data) {
    selectedPackage = data
    packageInfoPopupTitle.innerText = data["title"]
    packageInfoPopupMadeby.innerText = `Made By ${data["madeby"]}`
    packageInfoPopupAbout.innerText = data["about"]
    const content = data["content"]
    for (let name of Object.keys(content)) {
        const div = document.createElement("div")
        div.innerText = name
        div.setAttribute("id", "packageInfoPopupContent")
        const color = content[name]["color"]
        let textColor = content[name]["text"]
        if (textColor == undefined) {textColor = [0, 0, 0]}
        div.style.color = `rgb(${textColor[0]}, ${textColor[1]}, ${textColor[2]})`
        div.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        packageInfoPopupContentList.appendChild(div)
     }

    packageInfoPopupAddBtn.removeEventListener("click", addPackage)
    packageInfoPopupAddBtn.removeEventListener("click", removePackage)
    if (loadingPackage == selectedPackage["title"]) {
        if (lang.includes("ko")) {packageInfoPopupAddBtn.innerText = "등록중"}
        else if (lang.includes("jp")) {packageInfoPopupAddBtn.innerText = "登録中"}
        else {packageInfoPopupAddBtn.innerText = "Registering"}
    }
    else if (JSON.parse(localStorage["packages"]).includes(selectedPackage["title"])) {
        if (lang.includes("ko")) {packageInfoPopupAddBtn.innerText = "삭제하기"}
        else if (lang.includes("jp")) {packageInfoPopupAddBtn.innerText = "削除"}
        else {packageInfoPopupAddBtn.innerText = "Remove"}
        packageInfoPopupAddBtn.addEventListener("click", removePackage)
    } else {
        console.log(selectedPackage["title"])
        if (lang.includes("ko")) {packageInfoPopupAddBtn.innerText = "등록하기"}
        else if (lang.includes("jp")) {packageInfoPopupAddBtn.innerText = "登録"}
        else {packageInfoPopupAddBtn.innerText = "Register"}
        packageInfoPopupAddBtn.addEventListener("click", addPackage)
    }

    if (packageInfoPopup.style.display == "none" || packageInfoPopup.style.display == "") {
        packageInfoPopup.style.display = "block"
        packageInfoPopup.classList.remove("hidePopup")
        packageInfoPopup.classList.add("showPopup")
    }
}

function showPackageInfo(name, file=false) {
    if (localStorage["packages"] == undefined) {localStorage["packages"] = "[]"}
    while (packageInfoPopupContentList.hasChildNodes()) {
        packageInfoPopupContentList.removeChild(packageInfoPopupContentList.firstChild)
    }

    if (!file) {
        fetch(url+name.replaceAll(" ", "%20")+"/package.json")
        .then(res => res.json()).catch((err) => {
            packageInfoPopup.style.display = "none"
            handleError(err)
            return 0
        })
        .then(data => {
            loadPackageInfo(data)
        })
    } else {
        loadPackageInfo(selectedPackage)
    }
}

const removeTuberPopupList = document.querySelector("#removeTuberPopupList")
function removePackage() {
    const data = selectedPackage
    const list = Object.keys(data["content"])
    const mainJson = JSON.parse(localStorage["youtuber"])
    const packageJson = JSON.parse(localStorage["packages"])
    for (let key of list) {
        delete mainJson[key]
        localStorage["youtuber"] = JSON.stringify(mainJson)
        while (tuberListContainer.hasChildNodes()) {
            tuberListContainer.removeChild(tuberListContainer.firstChild)
        }
        while (removeTuberPopupList.hasChildNodes()) {
            removeTuberPopupList.removeChild(removeTuberPopupList.firstChild)
        }
        loadList()
        removeTuber()
        localStorage.removeItem(key)
    }
    delete packageJson[packageJson.indexOf(data["title"])]
    localStorage["packages"] = JSON.stringify(packageJson)
    setTimeout(() => {location.reload()}, 1000)
}

import addTuber  from "./index.js"
function addPackage() {
    const data = selectedPackage
    if (localStorage["packages"] == undefined) {localStorage["packages"] = "[]"}
    const packageJson = JSON.parse(localStorage["packages"])
    if (JSON.parse(localStorage["packages"]).includes(selectedPackage["title"])) {
        if (lang.includes("ko")) {ipcRenderer.invoke("showMessage", "중복 패키지", "이미 등록된 패키지에요")}
        else if (lang.includes("jp")) {ipcRenderer.invoke("showMessage", "冗長パッケージ", "すでに登録されているパッケージです。")}
        else {ipcRenderer.invoke("showMessage", "Duplicate Package", "This Package is already registered.")}
        selectedPackage = null
        return 0
    }
    if (lang.includes("ko")) {packageInfoPopupAddBtn.innerText = "등록중"}
    else if (lang.includes("jp")) {packageInfoPopupAddBtn.innerText = "登録中"}
    else {packageInfoPopupAddBtn.innerText = "Registering"}
    packageInfoPopupAddBtn.removeEventListener("click", addPackage)
    const list = Object.keys(data["content"])
    loadingPackage = selectedPackage["title"]
    for (let i=0, pending = Promise.resolve(); i<list.length; i++) {
        pending = pending.then(() => {
            return new Promise(resolve => {
                if (list[i] == list.slice(-1)[0]) {addTuber(null, data["content"][list[i]]["url"], () => {setTimeout(() => {resolve("end")}, 15000)})}
                else {addTuber(null, data["content"][list[i]]["url"], () => {setTimeout(() => {resolve("yet")}, 15000)})}
            })
        }).then((res) => {
            console.log(res)
            if (res == "end") {
                loadingPackage = null
                if (JSON.parse(localStorage["packages"]).includes(selectedPackage["title"])) {
                    if (lang.includes("ko")) {packageInfoPopupAddBtn.innerText = "삭제하기"}
                    else if (lang.includes("jp")) {packageInfoPopupAddBtn.innerText = "削除"}
                    else {packageInfoPopupAddBtn.innerText = "Remove"}
                    packageInfoPopupAddBtn.addEventListener("click", removePackage)
                }
            }
        })
    }
    packageJson.push(data["title"])
    localStorage["packages"] = JSON.stringify(packageJson)
}

export  default function addPackageFile(event) {
    event.preventDefault()
    const reader = new FileReader
    reader.onload = () => {
        try {
            setTimeout(() => {addTuberPopupFormFileInput.value = ""}, 2000)
            selectedPackage = JSON.parse(reader.result)
            if (localStorage["packages"] == undefined) {localStorage["packages"] = "[]"}
            showPackageInfo(null, true)
        } catch (error) {
            handleError(error)
        }
    }
    reader.readAsText(addTuberPopupFormFileInput.files[0], "utf-8")
}

const showPackagePopupList = document.querySelector("#showPackagePopupList")
export  function showPackage() {
    fetch("https://raw.githubusercontent.com/cottons-kr/yf-archive/main/packages.json").then(res => res.json())
    .then(data => {
        console.log(data)
        while (showPackagePopupList.hasChildNodes()) {
            showPackagePopupList.removeChild(showPackagePopupList.firstChild)
        }

        for (let p of Object.keys(data)) {
            const div = document.createElement("div")
            const name = document.createElement("div")
            const madeby = document.createElement("div")

            div.setAttribute("id", "package")
            div.style.backgroundColor = `rgba(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]}, 0.25)`
            name.innerText = p
            name.setAttribute("id", "packageName")
            madeby.innerText = `Made by ${data[p]}`
            madeby.setAttribute("id", "packageMadeby")
            div.appendChild(name)
            div.appendChild(madeby)

            div.addEventListener("click", () => {showPackageInfo(p)})

            showPackagePopupList.appendChild(div)
        }
    })
}
