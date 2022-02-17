const youtubePlayer = document.querySelector("#player")
const youtubePlayerPopup = document.querySelector(".youtubePlayer")
const youtubePlayerExit = document.querySelector("#youtubePlayerExit")

export default function loadPlayer(key) {
    youtubePlayer.removeAttribute("style")
    youtubePlayer.src = `https://www.youtube-nocookie.com/embed/${key}?fs=0&rel=0`

    youtubePlayerPopup.style.display = "block"
    youtubePlayerPopup.classList.remove("hidePopup")
    youtubePlayerPopup.classList.add("showPopup")
}

youtubePlayerExit.addEventListener("click", () => {
    youtubePlayerPopup.classList.remove("showPopup")
    youtubePlayerPopup.classList.add("hidePopup")
    setTimeout(() => {youtubePlayerPopup.style.display = "none"; youtubePlayer.src = ""}, 250)
})