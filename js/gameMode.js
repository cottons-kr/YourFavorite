export let gamemode = false
import { loadingTuberList } from "./index.js"

const gameModeSwitch = document.querySelector("#gameModeSwitch")
const gameModeSwitchDot = document.querySelector("#gameModeSwitchDot")
const gameModeAlertPopupRoot = document.querySelector(".gameModeAlertPopupRoot")

if (localStorage["gamemode"] == undefined) {
    localStorage["gamemode"] = "false"
    gameModeSwitchDot.classList.add("switchOff")
    gameModeSwitchDot.classList.remove("switchOn")
    gamemode = false
    console.log("Gamemode : false")
}

if (localStorage["gamemode"] == "true") {
    gameModeSwitchDot.classList.add("switchOn")
    gameModeSwitchDot.classList.remove("switchOff")
    gamemode = true
    console.log("Gamemode : true")
}
else {
    gameModeSwitchDot.classList.add("switchOff")
    gameModeSwitchDot.classList.remove("switchOn")
    gamemode = false
    console.log("Gamemode : false")
}

gameModeSwitch.addEventListener("click", () => {
    if (!gamemode) {
        gameModeSwitchDot.classList.add("switchOn")
        gameModeSwitchDot.classList.remove("switchOff")
        if (!loadingTuberList.length == 0) {
            gameModeAlertPopupRoot.style.display = "block"
            gameModeAlertPopupRoot.classList.add("showPopup")
            gameModeAlertPopupRoot.classList.remove("hidePopup")
        }

        gamemode = true
        localStorage["gamemode"] = "true"
        console.log("Gamemode : true")
    }
    else {
        gameModeSwitchDot.classList.add("switchOff")
        gameModeSwitchDot.classList.remove("switchOn")
        gamemode = false
        localStorage["gamemode"] = "false"
        console.log("Gamemode : false")
    }
})

export function checkNoLoadingTuber() {
    if (!loadingTuberList.length == 0) {return false}
    gameModeAlertPopupRoot.classList.add("hidePopup")
    gameModeAlertPopupRoot.classList.remove("showPopup")
    setTimeout(() => {gameModeAlertPopupRoot.style.display = "none"}, 250)
}