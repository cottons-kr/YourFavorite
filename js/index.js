const { spawn } = require("child_process")

const addButton = document.querySelector("#addButtonImg")
const container = document.querySelector(".container")
const addTuberPopup = document.querySelector(".addTuberPopup")
const addTuberPopupForm = document.querySelector("#addTuberPopupForm")
const addTuberPopupInput = document.querySelector("#addTuberPopupForm input")
const addTuberPopupExit = document.querySelector("#addTuberPopupExit")
const tuberList = document.querySelector("#tuberList").children
const tuberListContainer = document.querySelector("#tuberList")


/* 유튜브 크롤링
function loadInfo() {
    const url = addTuberPopupInput.value
    let subscriber, channelName, profileImg;

    addTuberPopupInput.value = ""
    const getInfo = spawn("python", ["Youtube.py", url])
    getInfo.stdout.on("data", (result) => {
        const info = result.toString().split("::")
        subscriber = info[0]
        channelName = info[1]
        profileImg = info[2]
    })
}
*/

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

function addTuber(event) {
    event.preventDefault()
    const url = addTuberPopupInput.value
    let subscriber, channelName, profileImg;

    addTuberPopupInput.value = ""
    const getInfo = spawn("python", ["getSimpleInfo.py", url])
    getInfo.stdout.on("data", (result) => {
        const info = result.toString().split("::")
        subscriber = info[0]
        channelName = info[1]
        profileImg = info[2]

        const json = {
            "channelName": channelName,
            "profileImg": profileImg,
            "subscriber": subscriber,
            "url": url
        }
        localStorage.setItem(localStorage.length, JSON.stringify(json))
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