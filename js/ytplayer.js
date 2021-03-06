const YouTubePlayer = require("youtube-player")
const { BrowserWindow } = require('@electron/remote')

const youtubePlayerPopup = document.querySelector(".youtubePlayer")
const listContainer = document.querySelector(".listContainer")
const container = document.querySelector(".container")
const youtubePlayerTitle = document.querySelector("#youtubePlayerTitle")
const youtubePlayerInfo = document.querySelector("#youtubePlayerInfo")
const youtubePlayerExit = document.querySelector("#youtubePlayerExit")
const youtubePlayerVideoList = document.querySelector("#youtubePlayerVideoList")
const youtubePlayerPIP = document.querySelector("#youtubePlayerPIP")
let youtubePlayer = null
let currentKey = ""

const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay))

async function muteYtPlayer() {
    let volume = await youtubePlayer.getVolume()
    const waittime = 600 / volume
    console.log(waittime)
    for(;volume>0;volume-=1) {
        await youtubePlayer.setVolume(volume)
        await wait(waittime)
    }
}

function ytPlayerExit() {
    listContainer.style.pointerEvents = "all"
    container.style.pointerEvents = "all"
    youtubePlayerPopup.classList.remove("showPlayer")
    youtubePlayerPopup.classList.add("hidePlayer")
    muteYtPlayer()
    setTimeout(() => {
        youtubePlayerPopup.style.display = "none"
        youtubePlayerTitle.innerText = ""
        youtubePlayerInfo.innerText = ""
        youtubePlayer.destroy()
        youtubePlayer = null
    }, 710)
}

function makePlayer(key) {
    if (youtubePlayer == null) {youtubePlayer = YouTubePlayer("youtubeVideoPlayer")}
    currentKey = key
    youtubePlayer.loadVideoById(key)
}

function showInfo(video) {
    makePlayer(video[1].split("?v=")[1])
    youtubePlayerTitle.innerText = video[0]
    if (video[2] !== undefined) {
        if (video[2] == "") {
            youtubePlayerInfo.innerText = `조회수 : ${video[3]}`
        }
        else {
            youtubePlayerInfo.innerText = `조회수 : ${video[3]} / ${video[2]} 전`
        }
    } else {
        if (video[3] !== undefined) {
            youtubePlayerInfo.innerText = `조회수 : ${video[3]}`
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
                img.setAttribute("title", `${video[0]} / 조회수 : ${video[3]}`)
            } else {
                img.setAttribute("title", `${video[0]} / 조회수 : ${video[3]} / ${video[2]} 전`)
            }
        } else {
            if (video[3] !== undefined) {
                img.setAttribute("title", `${video[0]} / 조회수 : ${video[3]}`)
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
youtubePlayerPIP.addEventListener("click", () => {
    let win = new BrowserWindow({
        width: 420,
        height: 250,
        frame: false,
        transparent: true,
        resizable: true,
        simpleFullscreen: false,
        fullscreenable: false,
        maximizable: false,
        minimizable: false
    })
    win.on('maximize', () => {
        win.unmaximize()
    })
    win.setMenuBarVisibility(false)
    win.setAlwaysOnTop(true, "screen")
    win.loadFile("pip.html", {query: {"key": currentKey}})
})