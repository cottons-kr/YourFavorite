const { PythonShell } = require("python-shell")
const ColorThief = require('colorthief');
const os = require('os')
const fs = require("fs")
const path = require("path")
const { ipcRenderer } = require("electron")

import addPackageFile, { showPackage } from "./package.js";
import fileContent from "./getInfo.py.js"

const body = document.querySelector("body"),
      addButtonImg = document.querySelector("#addButtonImg"),
      addTuberPopup = document.querySelector(".addTuberPopup"),
      addTuberPopupFormUrl = document.querySelector("#addTuberPopupFormUrl"),
      addTuberPopupInput = document.querySelector("#addTuberPopupFormUrl input"),
      addTuberPopupExit = document.querySelector("#addTuberPopupExit"),
      tuberListContainer = document.querySelector("#tuberList"),
      infoProfileImg = document.querySelector("#infoProfileImg a img"),
      infoProfileLink = document.querySelector("#infoProfileImg a"),
      infoChannelName = document.querySelector("#infoChannelName h1"),
      infoSubscriber = document.querySelector("#infoSubscriber"),
      noList = document.querySelector("#noList"),
      infoAboutMoreButton = document.querySelector("#infoAboutMoreButton img"),
      infoAboutMorePopup = document.querySelector("#infoAboutMorePopup"),
      infoAboutMorePopupExitButton = document.querySelector("#infoAboutMorePopupExitButton"),
      infoStreamList = document.querySelector("#infoStreamList"),
      infoVideosList = document.querySelector("#infoVideosList"),
      infoCommunityList = document.querySelector("#infoCommunityList"),
      infoAbout = document.querySelector("#infoAbout"),
      infoTotalView = document.querySelector("#infoTotalView"),
      infoLocation = document.querySelector("#infoLocation"),
      infoJoinDate = document.querySelector("#infoJoinDate"),
      infoAboutmore = document.querySelector("#infoAboutmore"),
      infoRoot = document.querySelector(".infoRoot"),
      removeButtonImg = document.querySelector("#removeButtonImg"),
      removeTuberPopup = document.querySelector(".removeTuberPopup"),
      removeTuberPopupExit = document.querySelector("#removeTuberPopupExit"),
      removeTuberPopupList = document.querySelector("#removeTuberPopupList"),
      infoTuberLoading = document.querySelector("#infoTuberLoading"),
      infoTuberLoadingName = document.querySelector("#infoTuberLoading h2"),
      infoStream = document.querySelector(".infoStream"),
      infoCommunity = document.querySelector(".infoCommunity"),
      infoVideos = document.querySelector(".infoVideos"),
      infoAboutClass = document.querySelector(".infoAbout"),
      infoLocationRoot = document.querySelector("#infoLocationRoot"),
      infoVideoTitle = document.querySelector("#infoVideoTitle"),
      infoCommunityTitle = document.querySelector("#infoCommunityTitle h2"),
      infoStreamTitle = document.querySelector("#infoStreamTitle h2"),
      addTuberPopupFormFileInput = document.querySelector("#addTuberPopupFormFileInput")

/*globalInterval은 현재 정보가 표시된 유튜버의 자동새로고침 함수
loadingTuber는 현재 로딩상태, null이 아니면 함수실행중지*/

const rootPath = os.homedir()
const settingPath = path.resolve(rootPath, ".yf/setting.json")
const settings = JSON.parse(fs.readFileSync(settingPath, "utf8"))
const lang = Intl.DateTimeFormat().resolvedOptions().locale
const scriptPath = path.resolve(rootPath, ".yf/getInfo.py")

let globalInterval = null
let loadingTuber = null
let showingTuber = null
let mainColor = null
let loadedTuberList = []
let loadingTuberList = []

const option = {
    mode: "text",
    pythonPath: "",
    pythonOptions: ["-u"],
    scriptPath: "",
    encoding: "utf8"
}

fs.writeFileSync(scriptPath, fileContent, "utf8")

function handleError(msg) {
    console.log(msg)
    ipcRenderer.invoke("showMessage", "오류가 발생했어요!", `Github Issue탭에 문의해주시면 감사하겠습니다 :)\n\n${msg}`, "error")//.then(window.close)
}

function loadList() {
    if (localStorage["youtuber"] === undefined) {return null}
    const mainJson = JSON.parse(localStorage["youtuber"])
    for (let key of Object.keys(mainJson)) {
        addList(key)
    }
}

function setDefaultFontSize() {
    document.querySelector("html").style.fontSize = `${16 * (window.innerHeight/1080)}px`
    console.log(`Default Font Size has been set to ${document.querySelector("html").style.fontSize}`)
}

function addList(channelId) {
    const mainJson = JSON.parse(localStorage["youtuber"])
    const info = JSON.parse(mainJson[channelId])

    const channel = document.createElement("div")
    const channelButton = document.createElement("button")
    const listProfileImg = document.createElement("div")
    const listChannelName = document.createElement("div")
    const img = document.createElement("img")
    const h2 = document.createElement("h2")

    channel.setAttribute("id", info["channelName"])
    listProfileImg.setAttribute("id", "listProfileImg")
    listChannelName.setAttribute("id", "listChannelName")
    img.setAttribute("src", info["profileImg"])
    channelButton.setAttribute("id", "channelButton")
    channelButton.addEventListener("click", () => {loadInfo(channelId)})
    h2.innerText = info["channelName"]

    listProfileImg.appendChild(img)
    listChannelName.appendChild(h2)
    channel.appendChild(listProfileImg)
    channel.appendChild(listChannelName)
    channelButton.appendChild(channel)
    tuberListContainer.appendChild(channelButton)
    toggleNoList()
}

function addTuber(event) {
    event.preventDefault()
    console.log(`Adding Tuber...`)
    const url = addTuberPopupInput.value
    option.args = [url, "simple"]
    let channelName, profileImg, backgroundRgb;

    addTuberPopupInput.value = "";
    PythonShell.run(scriptPath, option, (error, result) => {
        if (error) {
            console.log(error.message)
            if (error.message.includes("InvalidArgumentException")) {
                ipcRenderer.invoke("showMessage", "URL 오류!", "URL이 잘못된것 같아요", "warning")
                return 0
            }
            handleError(error)
        }
        console.log(result)

        const data = result[0].replace("b'", '').replace("'", '')
        const buff = Buffer.from(data, "base64")
        const info = buff.toString("utf-8").split("::")

        channelName = info[0]
        profileImg = info[1]
        ColorThief.getColor(profileImg)
        .then(color => {
            backgroundRgb = color
            const json = {
                "channelName": channelName,
                "profileImg": profileImg,
                "backgroundRgb": backgroundRgb,
                "url": url
            }

            if (localStorage["youtuber"] === undefined) {localStorage.setItem("youtuber", "{}")}
            const mainJson = JSON.parse(localStorage["youtuber"])
            mainJson[channelName] = JSON.stringify(json)
            localStorage["youtuber"] = JSON.stringify(mainJson)
            addList(channelName)
            console.log(`New Tuber : ${channelName}`)
            loadInfo(channelName)
            removeTuber()
        })
        .catch(err => {handleError(err)})
    })
}

function removeTuber() {
    while (removeTuberPopupList.hasChildNodes()) {
        removeTuberPopupList.removeChild(removeTuberPopupList.firstChild)
    }
    loadRemoveList()

    function loadRemoveList() {
        if (localStorage["youtuber"] === undefined) {return null}
        const mainJson = JSON.parse(localStorage["youtuber"])
        for (let key of Object.keys(mainJson)) {
            const p = document.createElement("p")
            const button = document.createElement("button")
            p.innerText = key
            button.setAttribute("id", "removeTuberPopupListContent")
            button.style.backgroundColor = `rgba(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]}, 0.5)`
            button.appendChild(p)
            button.addEventListener("click", () => {setTimeout(() => {
                delete mainJson[key]
                localStorage["youtuber"] = JSON.stringify(mainJson)
                while (tuberListContainer.hasChildNodes()) {
                    tuberListContainer.removeChild(tuberListContainer.firstChild)
                }
                while (removeTuberPopupList.hasChildNodes()) {
                    removeTuberPopupList.removeChild(removeTuberPopupList.firstChild)
                }
                loadList()
                removeTuber()
                localStorage.removeItem(key)
            }, 50)})
            removeTuberPopupList.appendChild(button)
        }
        toggleNoList()
    }
}

function loadVideos(info, noContent) {
    infoVideoTitle.querySelector("h2").style.color = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`
    for (let video of info) {
        if (video[1] === undefined && infoVideosList.hasChildNodes() === false) {
            const h1 = document.createElement("h1")
            if (lang == "ko") {h1.innerText = "올린 영상이 없어요"}
            else {h1.innerText = "No Videos :("}
            h1.setAttribute("id", "noVideo")
            h1.classList.add("showVideo")
            setTimeout(() => {h1.classList.remove("showVideo")}, 400)
            infoVideosList.appendChild(h1)
            noContent.push("video")
            break
        }
        const div = document.createElement("div")
        const a = document.createElement("a")
        const img = document.createElement("img")
        div.setAttribute("id", "video")
        a.setAttribute("href", video[1])
        img.setAttribute("src", getThumbnail(video[1]))
        if (lang == "ko") {img.setAttribute("title", `${video[0]} / 조회수 : ${video[3]} / ${video[2]} 전`)}
        else {img.setAttribute("title", `${video[0]} / Views : ${video[3]} / ${video[2]} ago`)}
        img.setAttribute("id", "videoThumbnail")
        a.appendChild(img)
        div.appendChild(a)
        div.classList.add("showVideo")
        setTimeout(() => {div.classList.remove("showVideo")}, 400)
        infoVideosList.appendChild(div)
    }

}

function loadStreams(info, noContent) {
    infoStreamTitle.style.color = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`
    for (let stream of info) {
        if (stream[1] === undefined && infoStreamList.hasChildNodes() === false) {
            const h1 = document.createElement("h1")
            if (lang == "ko") {h1.innerText = "스트리밍을 하고있지 않아요"}
            else {h1.innerText = "No Stream :("}
            h1.setAttribute("id", "noStream")
            h1.classList.add("showStream")
            setTimeout(() => {h1.classList.remove("showStream")}, 400)
            infoStreamList.appendChild(h1)
            noContent.push("stream")
            break
        }
        const div = document.createElement("div")
        const a = document.createElement("a")
        const img = document.createElement("img")
        div.setAttribute("id", "stream")
        a.setAttribute("href", stream[1])
        a.setAttribute("id", "streamLink")
        img.setAttribute("src", getThumbnail(stream[1]))
        img.setAttribute("title", stream[0])
        img.setAttribute("id", "streamThumbnail")
        a.appendChild(img)
        div.appendChild(a)
        div.classList.add("showStream")
        setTimeout(() => {div.classList.remove("showStream")}, 400)
        infoStreamList.appendChild(div)
    }
}

function loadCommunitys(info, noContent) {
    infoCommunityTitle.style.color = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`
    if (info.length == 0 && infoCommunityList.hasChildNodes() === false) {
        const h1 = document.createElement("h1")
        if (lang == "ko") {h1.innerText = "커뮤니티 게시글이 없어요"}
        else {h1.innerText = "No Community :("}
        h1.setAttribute("id", "noCommunity")
        h1.classList.add("showCommunity")
        setTimeout(() => {h1.classList.remove("showCommunity")}, 400)
        infoCommunityList.appendChild(h1)
        noContent.push("community")
    }
    for (let community of info) {
        const div = document.createElement("div")
        const p = document.createElement("p")
        div.setAttribute("id", "community")
        div.setAttribute("style", `background-color: rgba(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]}, 0.2);`)
        if (lang == "ko") {div.setAttribute("title", `좋아요 : ${community[1]} / ${community[2]}`)}
        else {div.setAttribute("title", `Likes : ${community[1]} / ${community[2]}`)}
        p.innerText = community[0]
        div.appendChild(p)
        div.classList.add("showCommunity")
        setTimeout(() => {div.classList.remove("showCommunity")}, 400)
        infoCommunityList.appendChild(div)
    }
}

function showInfo(info, channelId) {
    showingTuber = channelId
    const mainJson = JSON.parse(localStorage["youtuber"])
    let noContent = []
    console.log(`Showing : ${channelId}`)
    const baseInfo = JSON.parse(mainJson[channelId])
    infoSubscriber.innerText = info["subscriber"]
    infoProfileLink.href = baseInfo["url"]
    infoChannelName.innerText = baseInfo["channelName"]
    if (lang == "ko") {infoProfileImg.title = `${baseInfo["channelName"]} 채널로 이동`}
    else {infoProfileImg.title = `Go to ${baseInfo["channelName"]}'s Channel`}
    infoProfileImg.src = baseInfo["profileImg"]
    const rgb = baseInfo["backgroundRgb"]
    changeBgColor(rgb)

    loadStreams(info["streams"], noContent)
    loadVideos(info["videos"], noContent)
    loadCommunitys(info["communitys"], noContent)

    const about = info["about"]
    if (lang == "ko") {infoAbout.innerText = "채널 설명"}
    else {infoAbout.innerText = "About Description"}

    infoAboutClass.style.display = "inline-block"
    infoSubscriber.style.visibility = "visible"
    infoChannelName.style.visibility = "visible"
    infoProfileImg.style.visibility = "visible"
    infoTotalView.innerText = about[3]
    infoLocation.innerText = locationFilter(about)
    infoJoinDate.innerText = about[2]
    infoAboutmore.innerText = about[0]

    infoChannelName.style.display = "inline-block"
    infoTuberLoading.style.display = "none"
    infoRoot.style.display = "flex"
    infoProfileImg.style.display = "inline-block"

    if (noContent.includes("stream") && noContent.includes("community")) {
        console.log(`${channelId} : Only Videos`)
        infoCommunity.style.display = "none"
        infoStream.style.display = "none"
        infoVideos.classList.add("onlyVideos")
        infoVideosList.classList.add("onlyVideosList")
        infoVideoTitle.classList.add("onlyVideosTitle")
        for (let video of document.querySelectorAll("#video")) {video.classList.add("onlyVideo")}
    } else {
        infoCommunity.style.display = "block"
        infoStream.style.display = "block"
        infoVideos.classList.remove("onlyVideos")
        infoVideosList.classList.remove("onlyVideosList")
        infoVideoTitle.classList.remove("onlyVideosTitle")
        for (let video of document.querySelectorAll("#video")) {video.classList.remove("onlyVideo")}
    }

    globalInterval = setInterval(autoRefresh, settings["autoReloadDelay"][0], channelId)
    loadingTuber = null
}

function loadInfo(channelId) {
    localStorage["recentTuber"] = channelId
    loadingTuber = channelId
    console.log(`Loading : ${channelId}`)
    showingTuber = channelId
    toggleNoList()
    clearInfo()
    if (globalInterval !== null) {
        clearInterval(globalInterval)
        globalInterval = null
    }

    if (localStorage[channelId] !== undefined) {showInfo(JSON.parse(localStorage[channelId]), channelId); return null}
    const mainJson = JSON.parse(localStorage["youtuber"])
    const info = JSON.parse(mainJson[channelId])
    option.args = [info["url"], "all"]
    infoTuberLoading.style.display = "block"
    if (lang == "ko") {infoTuberLoadingName.innerText = `${info["channelName"]} 로딩중...`}
    else {infoTuberLoadingName.innerText = `Loading ${info["channelName"]}...`}
    PythonShell.run(scriptPath, option, (error, result) => {
        if (error) {
            handleError(error)
        }

        const data = result[0].replace("b'", '').replace("'", '')
        const buff = Buffer.from(data, "base64")
        let info = buff.toString("utf-8")
        info = JSON.parse(info)
        if (loadingTuber !== channelId) {
            console.log(`${channelId} : Load Saved [${loadingTuber}]`)
            localStorage[channelId] = JSON.stringify(info)
            return null
        }
        localStorage[channelId] = JSON.stringify(info)

        showInfo(info, channelId)
    })
    if (showingTuber !== channelId) {
        return null
    }
}

function autoRefresh(channelId) {
    if (showingTuber !== channelId || loadingTuber !== null) {
        console.log(`${channelId} : Refresh Canceled [다른 유튜버 로딩중 : ${loadingTuber}]`)
        return null
    }
    console.log(`${channelId} : Refresh!`)
    loadingTuber = `Refreshing : ${channelId}`
    const mainJson = JSON.parse(localStorage["youtuber"])
    const info = JSON.parse(mainJson[channelId])
    let noContent = []
    option.args = [info["url"], "all"]
    PythonShell.run(scriptPath, option, (error, result) => {
        if (error) {
            handleError(error)
        }

        const data = result[0].replace("b'", '').replace("'", '')
        const buff = Buffer.from(data, "base64")
        let info = buff.toString("utf-8")
        info = JSON.parse(info)
        if (localStorage[channelId] == undefined) {console.log(`Refresh Canceled : 삭제된 유튜버`); return null}
        let oldinfo = JSON.parse(localStorage[channelId])
        if (oldinfo === undefined) {oldinfo = JSON.parse(JSON.stringify(info))}

        if (loadingTuber !== `Refreshing : ${channelId}`) {
            console.log(`${channelId} : Refresh Saved [${loadingTuber}]`)
            localStorage[channelId] = JSON.stringify(info)
            return null
        }

        infoSubscriber.innerText = info["subscriber"]

        if (info["streams"] !== "CantLoad") {
            loadStreams(info["streams"].filter(x => {oldinfo["streams"].includes(x)}), noContent)
        } else {noContent.push("stream")}

        if (info["videos"] !== "CantLoad") {
            loadVideos(info["videos"].filter(x => {oldinfo["videos"].includes(x)}), noContent)
        } else {noContent.push("video")}

        if (info["communitys"].length !== 0) {
            loadCommunitys(info["communitys"].filter(x => {oldinfo["communitys"].includes(x)}), noContent)
        } else {noContent.push("community")}

        const about = info["about"]
        infoTotalView.innerText = about[3]
        infoLocation.innerText = locationFilter(about)
        infoJoinDate.innerText = about[2]
        infoAboutmore.innerText = about[0]
        loadingTuber = null

        if (noContent.includes("stream") && noContent.includes("community")) {
            console.log(`${channelId} : Only Videos`)
            infoCommunity.style.display = "none"
            infoStream.style.display = "none"
            infoVideos.classList.add("onlyVideos")
            infoVideosList.classList.add("onlyVideosList")
            infoVideoTitle.classList.add("onlyVideosTitle")
            for (let video of document.querySelectorAll("#video")) {video.classList.add("onlyVideo")}
        } else {
            infoCommunity.style.display = "block"
            infoStream.style.display = "block"
            infoVideos.classList.remove("onlyVideos")
            infoVideosList.classList.remove("onlyVideosList")
            infoVideoTitle.classList.remove("onlyVideosTitle")
            for (let video of document.querySelectorAll("#video")) {video.classList.remove("onlyVideo")}
        }
        
        localStorage[channelId] = JSON.stringify(info)
        console.log(`${channelId} : Refreshed!`)
    })
}

function clearInfo() {
    infoAboutClass.style.display = "none"
    infoTotalView.innerText = ""
    infoLocation.innerText = ""
    infoJoinDate.innerText = ""
    infoAboutmore.innerText = ""
    infoAbout.innerText = ""

    infoChannelName.style.visibility = "hidden"
    infoSubscriber.style.visibility = "hidden"
    infoProfileImg.style.visibility = "hidden"

    infoRoot.style.display = "none"

    while (infoStreamList.hasChildNodes()) {
        infoStreamList.removeChild(infoStreamList.firstChild)
    }
    while (infoVideosList.hasChildNodes()) {
        infoVideosList.removeChild(infoVideosList.firstChild)
    }
    while (infoCommunityList.hasChildNodes()) {
        infoCommunityList.removeChild(infoCommunityList.firstChild)
    }
}

function toggleNoList() {
    if (localStorage["youtuber"] === undefined) {localStorage["youtuber"] = "{}"}
    if (localStorage["youtuber"].length <= 2 && showingTuber === null) {
        noList.style.display = "block"
    } else {
        noList.style.display = "none"
    }
}

function getThumbnail(url) {
    return (`https://i.ytimg.com/vi/${url.replace(/^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/g,"$1")}/original.jpg`)
}

function showMoreAbout() {
    infoAboutMorePopup.style.display = "block"
    infoAboutMorePopup.classList.remove("hidePopup")
    infoAboutMorePopup.classList.add("showPopup")
}

function showRecentTuber() {
    if (loadingTuber !== null) {return null}
    const mainJson = JSON.parse(localStorage["youtuber"])
    if (localStorage["recentTuber"] === undefined || localStorage["recentTuber"] === "undefined") {
        if (Object.keys(mainJson) === "{}") {localStorage.removeItem("recentTuber"); return null}
        if (noList.style.display !== "none") {return null}
        localStorage["recentTuber"] = Object.keys(mainJson)[0]
    }
    if (localStorage["recentTuber"] in Object.keys(mainJson) === false) {
        localStorage["recentTuber"] = Object.keys(mainJson)[0]
    }
    loadInfo(localStorage["recentTuber"])
}

function locationFilter(about) {
    if (about[1] === "") {infoLocationRoot.style.display = "none"; return "none"}
    infoLocationRoot.style.display = "block"
    return about[1]
}

function autoPreload() {
    const mainJson = JSON.parse(localStorage["youtuber"])
    let mainJsonExceptShowingTuber = Object.keys(mainJson)
    mainJsonExceptShowingTuber.splice(Object.keys(mainJson).indexOf(showingTuber), 1)
    if (JSON.stringify(mainJsonExceptShowingTuber) == JSON.stringify(loadedTuberList)) {loadedTuberList = []}
    for (let channelName of Object.keys(JSON.parse(localStorage["youtuber"]))) {
        if (showingTuber === channelName) {continue}
        if (loadedTuberList.includes(channelName)) {continue}
        if (loadingTuberList.length >= parseInt(settings["simultaneousLoadNumber"][0])) {break}
        loadingTuberList.push(channelName)
        option.args = [JSON.parse(JSON.parse(localStorage["youtuber"])[channelName])["url"], "all"]
        console.log(`Preloading : ${channelName}`)
        PythonShell.run(scriptPath, option, (error, result) => {
            if (error) {
                handleError(error)
            }
    
            const data = result[0].replace("b'", '').replace("'", '')
            const buff = Buffer.from(data, "base64")
            let info = buff.toString("utf-8")
            info = JSON.parse(info)
            localStorage[channelName] = JSON.stringify(info)
            loadedTuberList.push(channelName)
            loadingTuberList.splice(loadingTuberList.indexOf(channelName), 1)
            console.log(`Preloaded : ${channelName}`)
        })
    }
}

function changeBgColor(rgb = null) {
    if (settings["defaultBackground"][0] !== "true") {
        if (rgb === null) {body.setAttribute("style", `background-color: tomato !important;`)}
        else {body.setAttribute("style", `background: rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]}) !important;`)}
        mainColor = rgb
    } else {
        body.setAttribute("style", "background: linear-gradient(45deg, whitesmoke, tomato) no-repeat fixed;")
        mainColor = [255, 99, 71]
    }
}

addButtonImg.addEventListener("mouseover", () => {
    addButtonImg.style.opacity = 1
})

addButtonImg.addEventListener("mouseout", () => {
    addButtonImg.style.opacity = 0.1
})

removeButtonImg.addEventListener("mouseover", () => {
    removeButtonImg.style.opacity = 1
})

removeButtonImg.addEventListener("mouseout", () => {
    removeButtonImg.style.opacity = 0.1
})

const showPackagePopup = document.querySelector(".showPackagePopup")
addButtonImg.addEventListener("click", () => {
    showPackage()
    addTuberPopup.style.display = "block"
    showPackagePopup.style.display = "block"
    addTuberPopup.classList.remove("hidePopup")
    showPackagePopup.classList.remove("hidePopup")
    addTuberPopup.classList.add("showPopup")
    showPackagePopup.classList.add("showPopup")
})

const packageInfoPopup = document.querySelector(".packageInfoPopup")
addTuberPopupExit.addEventListener("click", () => {
    addTuberPopup.classList.remove("showPopup")
    packageInfoPopup.classList.remove("showPopup")
    showPackagePopup.classList.remove("showPopup")
    addTuberPopup.classList.add("hidePopup")
    packageInfoPopup.classList.add("hidePopup")
    showPackagePopup.classList.add("hidePopup")
    setTimeout(() => {
        addTuberPopup.style.display = "none"
        showPackagePopup.style.display = "none"
        packageInfoPopup.style.display = "none"
    }, 250)
})

removeButtonImg.addEventListener("click", () => {
    removeTuberPopup.style.display = "block"
    removeTuberPopup.classList.remove("hidePopup")
    removeTuberPopup.classList.add("showPopup")
    removeTuber()
})

removeTuberPopupExit.addEventListener("click", () => {
    removeTuberPopup.classList.remove("addPopup")
    removeTuberPopup.classList.add("hidePopup")
    setTimeout(() => {removeTuberPopup.style.display = "none"}, 250)
})

addTuberPopupFormUrl.addEventListener("submit", addTuber)
addTuberPopupFormFileInput.addEventListener("change", addPackageFile)
infoAboutMoreButton.addEventListener("click", showMoreAbout)
infoAboutMorePopupExitButton.addEventListener("click", () => {
    infoAboutMorePopup.classList.remove("addPopup")
    infoAboutMorePopup.classList.add("hidePopup")
    setTimeout(() => {infoAboutMorePopup.style.display = "none"}, 250)
})

window.addEventListener("resize", setDefaultFontSize)

const loading = document.querySelector(".loading")
window.onload = () => {
    clearInfo()
    loadList()
    toggleNoList()
    setDefaultFontSize()
    setTimeout(showRecentTuber, 500)
    setTimeout(autoPreload, 1500)
    setInterval(autoPreload, settings["preloadDelay"][0])
    changeBgColor()
    setTimeout(() => {
        loading.classList.add("hideLoading")
        setTimeout(() => {loading.style.display = "none"}, 1000)
    }, 1500)
}