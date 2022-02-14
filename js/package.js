const { ipcRenderer } = require("electron")

const url  = "https://raw.githubusercontent.com/cottons-kr/yf-archive/main/"

function handleError(msg) {
    console.log(msg)
    ipcRenderer.invoke("showMessage", "패키지 오류!", "올바른 형식의 패키지가 아니에요", "warning")
}

const packageInfoPopupAddBtn = document.querySelector("#packageInfoPopupAddBtn")
packageInfoPopupAddBtn.addEventListener("click", addPackage)

let selectedPackage
const packageInfoPopup = document.querySelector(".packageInfoPopup")
const packageInfoPopupTitle = document.querySelector("#packageInfoPopupTitle")
const packageInfoPopupMadeby = document.querySelector("#packageInfoPopupMadeby")
const packageInfoPopupAbout = document.querySelector("#packageInfoPopupAbout")
const packageInfoPopupContentList = document.querySelector("#packageInfoPopupContentList")
function showPackageInfo(name) {
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

        if (packageInfoPopup.style.display == "none" || packageInfoPopup.style.display == "") {
            packageInfoPopup.style.display = "block"
            packageInfoPopup.classList.remove("hidePopup")
            packageInfoPopup.classList.add("showPopup")
        }
    })
}

import addTuber  from "./index.js"
function addPackage() {
    const data = selectedPackage
    const list = Object.keys(data["content"])
    for (let i=0, pending = Promise.resolve(); i<list.length; i++) {
        pending = pending.then(() => {
            return new Promise(resolve => {
                addTuber(null, data["content"][list[i]]["url"], resolve)
            })
        }).then(() => {
            ;
        })
    }
}

export  default function addPackageFile(event) {
    event.preventDefault()
    const reader = new FileReader
    reader.onload = () => {
        try {
            selectedPackage = JSON.parse(reader.result)
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
