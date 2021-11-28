const { PythonShell } = require("python-shell")
const os = require('os');

const addButton = document.querySelector("#addButtonImg")
const container = document.querySelector(".container")
const addTuberPopup = document.querySelector(".addTuberPopup")
const addTuberPopupForm = document.querySelector("#addTuberPopupForm")
const addTuberPopupInput = document.querySelector("#addTuberPopupForm input")
const addTuberPopupExit = document.querySelector("#addTuberPopupExit")
const tuberList = document.querySelector("#tuberList").children
const tuberListContainer = document.querySelector("#tuberList")

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
        const listProfileImg = document.createElement("div")
        const listChannelName = document.createElement("div")
        const img = document.createElement("img")
        const p = document.createElement("p")

        channel.setAttribute("id", "channel")
        listProfileImg.setAttribute("id", "listProfileImg")
        listChannelName.setAttribute("id", "listChannelName")
        img.setAttribute("src", info["profileImg"])
        p.innerText = info["channelName"]

        listProfileImg.appendChild(img)
        listChannelName.appendChild(p)
        channel.appendChild(listProfileImg)
        channel.appendChild(listChannelName)
        tuberListContainer.appendChild(channel)
     }
}

function addList(number) {
    let info = localStorage.getItem(localStorage.key(number.toString()))
    info = JSON.parse(info)

    const channel = document.createElement("div")
    const listProfileImg = document.createElement("div")
    const listChannelName = document.createElement("div")
    const img = document.createElement("img")
    const p = document.createElement("p")

    channel.setAttribute("id", "channel")
    listProfileImg.setAttribute("id", "listProfileImg")
    listChannelName.setAttribute("id", "listChannelName")
    img.setAttribute("src", info["profileImg"])
    p.innerText = info["channelName"]

    listProfileImg.appendChild(img)
    listChannelName.appendChild(p)
    channel.appendChild(listProfileImg)
    channel.appendChild(listChannelName)
    tuberListContainer.appendChild(channel)
}

/*
subscriber = info[0]
channelName = info[1]
profileImg = info[2]
*/

function addTuber(event) {
    event.preventDefault()
    const url = addTuberPopupInput.value
    option.args = [url]
    console.log(option)
    let subscriber, channelName, profileImg;

    addTuberPopupInput.value = ""
    PythonShell.run("getInfo.py", option, (error, result) => {
        if (error) {
            console.log("Error")
        }

        const data = result[0].replace("b'", '').replace("'", '')
        const buff = Buffer.from(data, "base64")
        const info = buff.toString("utf-8").split("::")
        
        subscriber = info[0]
        channelName = info[1]
        profileImg = info[2]
        const json = {
            "channelName": channelName,
            "profileImg": profileImg,
            "subscriber": subscriber,
            "url": url
        }
        const number = localStorage.length
        localStorage.setItem(number, JSON.stringify(json))
        addList(number)
    })
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

if (localStorage.length == 0) {
    container.innerHTML = `<h1 id="noList">등록한 유튜버가 없습니다. 옆에 있는 추가 버튼으로 추가해보세요!</h1>`
}

loadList()