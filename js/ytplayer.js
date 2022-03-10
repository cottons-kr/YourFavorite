const YouTubePlayer = require("youtube-player")

const youtubePlayerPopup = document.querySelector(".youtubePlayer")
const listContainer = document.querySelector(".listContainer")
const container = document.querySelector(".container")
const youtubePlayerTitle = document.querySelector("#youtubePlayerTitle")
const youtubePlayerInfo = document.querySelector("#youtubePlayerInfo")
const youtubePlayerExit = document.querySelector("#youtubePlayerExit")
const youtubePlayerVideoList = document.querySelector("#youtubePlayerVideoList")
let youtubePlayer = null
import { lang } from "./index.js"

function ytPlayerExit() {
    listContainer.style.pointerEvents = "all"
    container.style.pointerEvents = "all"
    youtubePlayerPopup.classList.remove("showPlayer")
    youtubePlayerPopup.classList.add("hidePlayer")
    setTimeout(() => {
        youtubePlayerPopup.style.display = "none"
        youtubePlayerTitle.innerText = ""
        youtubePlayerInfo.innerText = ""
        youtubePlayer.destroy()
        youtubePlayer = null
    }, 700)
}

function makePlayer(key) {
    if (youtubePlayer == null) {youtubePlayer = YouTubePlayer("youtubeVideoPlayer")}
    youtubePlayer.loadVideoById(key)
}

function showInfo(video) {
    makePlayer(video[1].split("?v=")[1])
    youtubePlayerTitle.innerText = video[0]
    if (video[2] !== undefined) {
        if (video[2] == "") {
            if (lang.includes("ko")) {youtubePlayerInfo.innerText = `조회수 : ${video[3]}`}
            else if (lang.includes("ja")) {youtubePlayerInfo.innerText = `ヒット : ${video[3]}`}
            else {youtubePlayerInfo.innerText = `Views : ${video[3]}`}
        }
        else {
            if (lang.includes("ko")) {youtubePlayerInfo.innerText = `조회수 : ${video[3]} / ${video[2]} 전`}
            else if (lang.includes("ja")) {youtubePlayerInfo.innerText = `ヒット : ${video[3]} / ${video[2]}前`}
            else {youtubePlayerInfo.innerText = `Views : ${video[3]} / ${video[2]} ago`}
        }
    } else {
        if (video[3] !== undefined) {
            if (lang.includes("ko")) {youtubePlayerInfo.innerText = `조회수 : ${video[3]}`}
            else if (lang.includes("ja")) {youtubePlayerInfo.innerText = `ヒット : ${video[3]}`}
            else {youtubePlayerInfo.innerText = `Views : ${video[3]}`}
        } else {youtubePlayerInfo.innerText = ""}
    }
}

function getThumbnail(url) {
    return (`https://i.ytimg.com/vi/${url.replace(/^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/g,"$1")}/original.jpg`)
}

export default function loadPlayer(data, channelVideos) {
    while (youtubePlayerVideoList.hasChildNodes()) {
        youtubePlayerVideoList.removeChild(youtubePlayerVideoList.lastChild)
    }
    listContainer.style.pointerEvents = "none"
    container.style.pointerEvents = "none"
    showInfo(data)

    for (let video of channelVideos) {
        const div = document.createElement("div")
        const img = document.createElement("img")
        div.setAttribute("id", "youtubePlayerVideo")
        img.setAttribute("src", getThumbnail(video[1]))
        if (video[2] !== undefined) {
            if (video[2] == "") {
                if (lang.includes("ko")) {img.setAttribute("title", `${video[0]} / 조회수 : ${video[3]}`)}
                else if (lang.includes("ja")) {img.setAttribute("title", `${video[0]} / ヒット : ${video[3]}`)}
                else {img.setAttribute("title", `${video[0]} / Views : ${video[3]}`)}
            } else {
                if (lang.includes("ko")) {img.setAttribute("title", `${video[0]} / 조회수 : ${video[3]} / ${video[2]} 전`)}
                else if (lang.includes("jp")) {img.setAttribute("title", `${video[0]} / ヒット : ${video[3]} / ${video[2]} 前`)}
                else {img.setAttribute("title", `${video[0]} / Views : ${video[3]} / ${video[2]} ago`)}
            }
        } else {
            if (video[3] !== undefined) {
                if (lang.includes("ko")) {img.setAttribute("title", `${video[0]} / 조회수 : ${video[3]}`)}
                else if (lang.includes("ja")) {img.setAttribute("title", `${video[0]} /  ヒット: ${video[3]}`)}
                else {img.setAttribute("title", `${video[0]} / Views : ${video[3]}`)}
            } else {img.setAttribute("title", video[0])}
        }

        div.addEventListener("click", () => {showInfo(video)})
        img.setAttribute("id", "videoThumbnail")
        div.appendChild(img)
        youtubePlayerVideoList.appendChild(div)
    }

    youtubePlayerPopup.style.display = "block"
    youtubePlayerPopup.classList.remove("hidePlayer")
    youtubePlayerPopup.classList.add("showPlayer")
}

youtubePlayerExit.addEventListener("click", ytPlayerExit)