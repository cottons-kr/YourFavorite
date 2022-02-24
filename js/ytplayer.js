const youtubePlayer = document.querySelector("#player")
const youtubePlayerPopup = document.querySelector(".youtubePlayer")
const listContainer = document.querySelector(".listContainer")
const container = document.querySelector(".container")
const youtubePlayerTitle = document.querySelector("#youtubePlayerTitle")
const youtubePlayerInfo = document.querySelector("#youtubePlayerInfo")
const youtubePlayerExit = document.querySelector("#youtubePlayerExit")
const youtubePlayerVideoList = document.querySelector("#youtubePlayerVideoList")
import { lang } from "./index.js"

function ytPlayerExit() {
    listContainer.style.pointerEvents = "all"
    container.style.pointerEvents = "all"
    youtubePlayerPopup.classList.remove("showPlayer")
    youtubePlayerPopup.classList.add("hidePlayer")
    setTimeout(() => {
        youtubePlayerPopup.style.display = "none"
        youtubePlayer.src = ""
        youtubePlayerTitle.innerText = ""
        youtubePlayerInfo.innerText = ""
    }, 700)
}

function getThumbnail(url) {
    return (`https://i.ytimg.com/vi/${url.replace(/^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/g,"$1")}/original.jpg`)
}

export default function loadPlayer(data, channelVideos) {
    while (youtubePlayerVideoList.hasChildNodes()) {
        youtubePlayerVideoList.removeChild(youtubePlayerVideoList.lastChild)
    }
    youtubePlayer.removeAttribute("style")
    listContainer.style.pointerEvents = "none"
    container.style.pointerEvents = "none"
    youtubePlayer.src = `https://www.youtube-nocookie.com/embed/${data[1].split("?v=")[1]}?rel=0`
    youtubePlayerTitle.innerText = data[0]
    if (data[2] !== undefined) {
        if (lang.includes("ko")) {youtubePlayerInfo.innerText = `조회수 : ${data[3]} / ${data[2]} 전`}
        else if (lang.includes("ko")) {youtubePlayerInfo.innerText = `ヒット : ${data[3]} / ${data[2]}前`}
        else {youtubePlayerInfo.innerText = `Views : ${data[3]} / ${data[2]} ago`}
    }

    for (let video of channelVideos) {
        const div = document.createElement("div")
        const img = document.createElement("img")
        div.setAttribute("id", "youtubePlayerVideo")
        img.setAttribute("src", getThumbnail(video[1]))
        if (video[2] == "") {
            if (lang.includes("ko")) {img.setAttribute("title", `${video[0]} / 조회수 : ${video[3]}`)}
            else if (lang.includes("jp")) {img.setAttribute("title", `${video[0]} /  ヒット: ${video[3]}`)}
            else {img.setAttribute("title", `${video[0]} / Views : ${video[3]}`)}
        } else {
            if (lang.includes("ko")) {img.setAttribute("title", `${video[0]} / 조회수 : ${video[3]} / ${video[2]} 전`)}
            else if (lang.includes("jp")) {img.setAttribute("title", `${video[0]} / ヒット : ${video[3]} / ${video[2]} 前`)}
            else {img.setAttribute("title", `${video[0]} / Views : ${video[3]} / ${video[2]} ago`)}
        }

        div.addEventListener("click", () => {
            youtubePlayer.src = `https://www.youtube-nocookie.com/embed/${video[1].split("?v=")[1]}?fs=0&rel=0`
            youtubePlayerTitle.innerText = video[0]
            if (video[2] !== undefined) {
                if (lang.includes("ko")) {youtubePlayerInfo.innerText = `조회수 : ${video[3]} / ${video[2]} 전`}
                else if (lang.includes("ko")) {youtubePlayerInfo.innerText = `ヒット : ${video[3]} / ${video[2]}前`}
                else {youtubePlayerInfo.innerText = `Views : ${video[3]} / ${video[2]} ago`}
            }
        })
        img.setAttribute("id", "videoThumbnail")
        div.appendChild(img)
        youtubePlayerVideoList.appendChild(div)
    }

    youtubePlayerPopup.style.display = "block"
    youtubePlayerPopup.classList.remove("hidePlayer")
    youtubePlayerPopup.classList.add("showPlayer")
}

youtubePlayerExit.addEventListener("click", ytPlayerExit)