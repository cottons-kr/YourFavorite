window.gamemode = false

const gameModeSwitch = document.querySelector("#gameModeSwitch")
const gameModeSwitchDot = document.querySelector("#gameModeSwitchDot")

gameModeSwitch.addEventListener("click", () => {
    if (!window.gamemode) {
        gameModeSwitchDot.classList.add("switchOn")
        gameModeSwitchDot.classList.remove("switchOff")
        window.gamemode = true
    }
    else {
        gameModeSwitchDot.classList.add("switchOff")
        gameModeSwitchDot.classList.remove("switchOn")
        window.gamemode = false
    }
})