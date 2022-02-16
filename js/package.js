const { ipcRenderer } = require("electron")

const url  = "https://raw.githubusercontent.com/cottons-kr/yf-archive/main/"

function handleError(msg) {
    console.log(msg)
    ipcRenderer.invoke("showMessage", "패키지 오류!", "올바른 형식의 패키지가 아니에요", "warning")
}

const packageInfoPopupAddBtn = document.querySelector("#packageInfoPopupAddBtn")

let selectedPackage, loadingPackage
const packageInfoPopup = document.querySelector(".packageInfoPopup")
const packageInfoPopupTitle = document.querySelector("#packageInfoPopupTitle")
const packageInfoPopupMadeby = document.querySelector("#packageInfoPopupMadeby")
const packageInfoPopupAbout = document.querySelector("#packageInfoPopupAbout")
const packageInfoPopupContentList = document.querySelector("#packageInfoPopupContentList")
function showPackageInfo(name) {
    if (localStorage["packages"] == undefined) {localStorage["packages"] = "[]"}
    while (packageInfoPopupContentList.hasChildNodes()) {
        packageInfoPopupContentList.removeChild(packageInfoPopupContentList.firstChild)
    }

    fetch(url+name.replaceAll(" ", "%20")+"/package.json")
    .then(res => res.json()).catch((err) => {
        packageInfoPopup.style.display = "none"
        handleError(err)
        return 0
    })
    .then(data => {
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
        if (loadingPackage == selectedPackage["title"]) {packageInfoPopupAddBtn.innerText = "등록중"}
        else if (JSON.parse(localStorage["packages"]).includes(selectedPackage["title"])) {
            packageInfoPopupAddBtn.innerText = "삭제하기"
            packageInfoPopupAddBtn.addEventListener("click", removePackage)
        } else {
            console.log(selectedPackage["title"])
            packageInfoPopupAddBtn.addEventListener("click", addPackage)
        }

        if (packageInfoPopup.style.display == "none" || packageInfoPopup.style.display == "") {
            packageInfoPopup.style.display = "block"
            packageInfoPopup.classList.remove("hidePopup")
            packageInfoPopup.classList.add("showPopup")
        }
    })
}

import { removeTuber, loadList } from "./index.js"
const tuberListContainer = document.querySelector("#tuberList")
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
    delete packageJson[data["title"]]
    localStorage["packages"] = JSON.parse(packageJson)
}

import addTuber  from "./index.js"
function addPackage() {
    const data = selectedPackage
    if (localStorage["packages"] == undefined) {localStorage["packages"] = "[]"}
    const packageJson = JSON.parse(localStorage["packages"])
    if (JSON.parse(localStorage["packages"]).includes(selectedPackage["title"])) {
        ipcRenderer.invoke("showMessage", "중복 패키지", "이미 등록된 패키지에요")
        selectedPackage = null
        return 0
    }
    packageInfoPopupAddBtn.innerText = "등록중"
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
            if (res == "end") {loadingPackage = null; packageInfoPopupAddBtn.innerText = "등록하기"}
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
            selectedPackage = JSON.parse(reader.result)
            if (JSON.parse(localStorage["packages"]).includes(selectedPackage["title"])) {
                ipcRenderer.invoke("showMessage", "중복 패키지", "이미 등록된 패키지에요")
                selectedPackage = null
                return 0
            }
            addPackage()
        } catch (error) {
            handleError(error)
        }
        setTimeout(() => {addTuberPopupFormFileInput.value = ""}, 2000)
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
