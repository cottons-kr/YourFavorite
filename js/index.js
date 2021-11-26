const { spawn } = require("child_process")

const addButton = document.querySelector("#addButtonImg")
const container = document.querySelector(".container")
const addTuberPopup = document.querySelector(".addTuberPopup")
const addTuberPopupForm = document.querySelector("#addTuberPopupForm")
const addTuberPopupInput = document.querySelector("#addTuberPopupForm input")
const addTuberPopupExit = document.querySelector("#addTuberPopupExit")

const REGEX = /[^0-9]/g

function loadInfo(event) {
    event.preventDefault()
    const url = addTuberPopupInput.value
    addTuberPopupInput.value = ""
    const getInfo = spawn("python", ["Youtube.py", url])
    getInfo.stdout.on("data", (result) => {
        const subscriber = decodeURIComponent(decodeURI(result))
        console.log(subscriber)
    })
}

function addTuber(url) {
    
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
addTuberPopupForm.addEventListener("submit", loadInfo)

if (localStorage.length == 0) {
    container.innerHTML = `<h1 id="noList">등록한 유튜버가 없습니다. 옆에 있는 추가 버튼으로 추가해보세요!</h1>`
}
