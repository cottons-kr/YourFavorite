export let gamemode = false
import { loadingTuberList } from "./index.js"

const gameModeSwitch = document.querySelector("#gameModeSwitch")
const gameModeSwitchDot = document.querySelector("#gameModeSwitchDot")
const gameModeAlertPopupRoot = document.querySelector(".gameModeAlertPopupRoot")

gameModeSwitch.addEventListener("click", () => {
    if (!gamemode) {
        gameModeSwitchDot.classList.add("switchOn")
        gameModeSwitchDot.classList.remove("switchOff")
        gameModeAlertPopupRoot.style.display = "block"
        gameModeAlertPopupRoot.classList.add("showPopup")
        gameModeAlertPopupRoot.classList.remove("hidePopup")
        checkNoLoadingTuber()

        gamemode = true
    }
    else {
        gameModeSwitchDot.classList.add("switchOff")
        gameModeSwitchDot.classList.remove("switchOn")
        gamemode = false
    }
})

export function checkNoLoadingTuber() {
    if (!loadingTuberList.length == 0) {return false}
    gameModeAlertPopupRoot.classList.add("hidePopup")
    gameModeAlertPopupRoot.classList.remove("showPopup")
    setTimeout(() => {gameModeAlertPopupRoot.style.display = "none"}, 250)
}