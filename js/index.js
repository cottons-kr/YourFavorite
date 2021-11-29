const { PythonShell } = require("python-shell")
const os = require('os');

const addButton = document.querySelector("#addButtonImg")
const container = document.querySelector(".container")
const addTuberPopup = document.querySelector(".addTuberPopup")
const addTuberPopupForm = document.querySelector("#addTuberPopupForm")
const addTuberPopupInput = document.querySelector("#addTuberPopupForm input")
const addTuberPopupExit = document.querySelector("#addTuberPopupExit")
const tuberListContainer = document.querySelector("#tuberList")
const infoProfileImg = document.querySelector("#infoProfileImg img")
const infoChannelName = document.querySelector("#infoChannelName h1")
const infoSubscriber = document.querySelector("#infoSubscriber")
const noList = document.querySelector("#noList")
const addTuberLoading = document.querySelector("#addTuberLoading")

const userName = os.userInfo().username
const pythonPath = `C:\\Users\\${userName}\\AppData\\Local\\Programs\\Python\\Python310\\python.exe`
const option = {
    mode: "text",
    pythonPath: pythonPath,
    pythonOptions: ["-u"],
    scriptPath: "",
    encoding: "utf8"
}


function loadList(){
    for(let i = 0; i < localStorage.length; i++){
        let info = localStorage.getItem(localStorage.key(i.toString()))
        info = JSON.parse(info)

        const channel = document.createElement("div")
        const channelButton = document.createElement("button")
        const listProfileImg = document.createElement("div")
        const listChannelName = document.createElement("div")
        const img = document.createElement("img")
        const p = document.createElement("p")

        channel.setAttribute("id", info["channelName"])
        listProfileImg.setAttribute("id", "listProfileImg")
        listChannelName.setAttribute("id", "listChannelName")
        img.setAttribute("src", info["profileImg"])
        channelButton.setAttribute("id", "channelButton")
        channelButton.addEventListener("click", () => {showInfo(i)})
        p.innerText = info["channelName"]

        listProfileImg.appendChild(img)
        listChannelName.appendChild(p)
        channel.appendChild(listProfileImg)
        channel.appendChild(listChannelName)
        channelButton.appendChild(channel)
        tuberListContainer.appendChild(channelButton)
        toggleNoList()
     }
}

function addList(number) {
    let info = localStorage.getItem(localStorage.key(number.toString()))
    info = JSON.parse(info)

    const channel = document.createElement("div")
    const channelButton = document.createElement("button")
    const listProfileImg = document.createElement("div")
    const listChannelName = document.createElement("div")
    const img = document.createElement("img")
    const p = document.createElement("p")

    channel.setAttribute("id", info["channelName"])
    listProfileImg.setAttribute("id", "listProfileImg")
    listChannelName.setAttribute("id", "listChannelName")
    img.setAttribute("src", info["profileImg"])
    channelButton.setAttribute("id", "channelButton")
    channelButton.addEventListener("click", () => {showInfo(number)})
    p.innerText = info["channelName"]

    listProfileImg.appendChild(img)
    listChannelName.appendChild(p)
    channel.appendChild(listProfileImg)
    channel.appendChild(listChannelName)
    channelButton.appendChild(channel)
    tuberListContainer.appendChild(channelButton)
    toggleNoList()
}

/*
subscriber = info[0]
channelName = info[1]
profileImg = info[2]
*/

function addTuber(event) {
    event.preventDefault()
    const url = addTuberPopupInput.value
    option.args = [url, "simple"]
    console.log(option)
    let subscriber, channelName, profileImg;

    addTuberPopupInput.value = ""
    addTuberPopupForm.style.display = "none"
    addTuberLoading.style.display = "block"
    PythonShell.run("getInfo.py", option, (error, result) => {
        if (error) {
            console.log("Error")
        }

        const data = result[0].replace("b'", '').replace("'", '')
        const buff = Buffer.from(data, "base64")
        const info = buff.toString("utf-8").split("::")

        channelName = info[0]
        profileImg = info[1]
        const json = {
            "channelName": channelName,
            "profileImg": profileImg,
            "url": url
        }
        const number = localStorage.length
        localStorage.setItem(number, JSON.stringify(json))
        addList(number)

        addTuberPopupForm.style.display = "block"
        addTuberLoading.style.display = "none"
    })
}

function showInfo(number) {
    let info = localStorage.getItem(localStorage.key(number.toString()))
    info = JSON.parse(info)
    infoProfileImg.src = info["profileImg"]
    infoChannelName.innerText = info["channelName"]
    if (info["subscriber"] === "notShown") {
        infoSubscriber.style.visibility = "hidden"
    } else {
        infoSubscriber.innerText = info["subscriber"]
    }
}

function toggleNoList() {
    if (noList.style.display !== "none" && localStorage.length !== 0) {
        noList.style.display = "none"
    }
}

addButton.addEventListener("mouseover", () => {
    addButton.style.opacity = 1
})
addButton.addEventListener("mouseout", () => {
    addButton.style.opacity = 0.1
})
addButton.addEventListener("click", () => {
    addTuberPopup.style.visibility = "visible"
})
addTuberPopupExit.addEventListener("click", () => {
    addTuberPopup.style.visibility = "hidden"
})
addTuberPopupForm.addEventListener("submit", addTuber)

loadList()

