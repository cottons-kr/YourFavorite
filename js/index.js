const childProcess = require("child_process")
const ColorThief = require('colorthief');
const os = require('os')
const fs = require("fs")
const path = require("path")
const { ipcRenderer } = require("electron")

import addPackageFile, { showPackage } from "./package.js";
import loadPlayer from "./ytplayer.js";

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
let lang = Intl.DateTimeFormat().resolvedOptions().locale

let globalInterval = null
let loadingTuber = null
let showingTuber = null
let mainColor = null
let loadedTuberList = []
let loadingTuberList = []

const url = location.href
if (url.includes("en")) {lang = "en"}
else if (url.includes("jp")) {lang = "ja"}
else {lang = "ko"}

function handleError(msg) {
    console.log(msg)
    if (lang.includes("ko")) {ipcRenderer.invoke("showMessage", "오류가 발생했어요!", `Github Issue탭에 문의해주시면 감사하겠습니다 :)\n\n${msg}`, "error")}
    else if (lang.includes("ja")) {ipcRenderer.invoke("showMessage", "エラーが発生しました!", `Github Issueタブにお問い合わせいただきありがとうございます :)\n\n${msg}`, "error")}
    else {ipcRenderer.invoke("showMessage", "An Error Occurred!", `Please let us know this error on Github Issue :)\n\n${msg}`, "error")}
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

    channel.setAttribute("id", info["channelName"])
    channel.setAttribute("title", info["channelName"])
    listProfileImg.setAttribute("id", "listProfileImg")
    listChannelName.setAttribute("id", "listChannelName")
    img.setAttribute("src", info["profileImg"])
    channelButton.setAttribute("id", "channelButton")
    channelButton.addEventListener("click", () => {loadInfo(channelId)})
    listChannelName.innerText = info["channelName"]

    listProfileImg.appendChild(img)
    channel.appendChild(listProfileImg)
    channel.appendChild(listChannelName)
    channelButton.appendChild(channel)
    tuberListContainer.appendChild(channelButton)
    toggleNoList()
}

function addTuber(event=null, url=null, callback=null) {
    if (event != null) {event.preventDefault()}
    console.log(`Adding Tuber...`)
    if (url == null) {
        url = addTuberPopupInput.value
    }
    let channelName, profileImg, backgroundRgb;

    addTuberPopupInput.value = "";
    childProcess.exec(`${path.resolve(__dirname, "getInfo")} ${url} simple`, (err, result) => {
        if (err) {
            console.log(err.message)
            if (err.message.includes("InvalidArgumentException")) {
                if (lang.includes("ko")) {ipcRenderer.invoke("showMessage", "URL 오류!", "URL이 잘못된것 같아요", "warning")}
                else if (lang.includes("ja")) {ipcRenderer.invoke("showMessage", "URLエラー!", "URLが間違っていると思います。", "warning")}
                else { ipcRenderer.invoke("showMessage", "URL Error!", "It seem the URL is wrong.", "warning")}
                return 0
            }
        }

        const data = result.replace("b'", '').replace("'", '')
        const buff = Buffer.from(data, "base64")
        console.log(buff)
        if (buff.includes("InvalidArgumentException")) {
            if (lang.includes("ko")) {ipcRenderer.invoke("showMessage", "URL 오류!", "URL이 잘못된것 같아요", "warning")}
            else if (lang.includes("ja")) {ipcRenderer.invoke("showMessage", "URLエラー!", "URLが間違っていると思います。", "warning")}
            else { ipcRenderer.invoke("showMessage", "URL Error!", "It seem the URL is wrong.", "warning")}
            return 0
        }
        else if (buff.includes("Traceback")) {handleError(buff)}
        else {
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
                mainColor = backgroundRgb
                removeTuber()
                if (callback != null) {callback()}
            }).catch(err => {handleError(err)})
        }
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
            button.style.backgroundColor = `rgba(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]}, 0.25)`
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
    infoVideoTitle.querySelector("h2").style.color = `rgb(${mainColor[0]-30}, ${mainColor[1]-30}, ${mainColor[2]-30})`
    for (let video of info) {
        if (video[1] === undefined && infoVideosList.hasChildNodes() === false) {
            const h1 = document.createElement("h1")
            if (lang.includes("ko")) {h1.innerText = "올린 영상이 없어요"}
            else if (lang.includes("ja")) {h1.innerText = "アップロードした画像はありません。"}
            else {h1.innerText = "No Videos :("}
            h1.setAttribute("id", "noVideo")
            h1.classList.add("showVideo")
            setTimeout(() => {h1.classList.remove("showVideo")}, 400)
            infoVideosList.appendChild(h1)
            noContent.push("video")
            break
        }
        const div = document.createElement("div")
        const img = document.createElement("img")
        div.setAttribute("id", "video")
        img.setAttribute("src", getThumbnail(video[1]))
        if (video[2] == "") {
            if (lang.includes("ko")) {img.setAttribute("title", `${video[0]} / 조회수 : ${video[3]}`)}
            else if (lang.includes("ja")) {img.setAttribute("title", `${video[0]} /  ヒット: ${video[3]}`)}
            else {img.setAttribute("title", `${video[0]} / Views : ${video[3]}`)}
        } else {
            if (lang.includes("ko")) {img.setAttribute("title", `${video[0]} / 조회수 : ${video[3]} / ${video[2]} 전`)}
            else if (lang.includes("ja")) {img.setAttribute("title", `${video[0]} / ヒット : ${video[3]} / ${video[2]} 前`)}
            else {img.setAttribute("title", `${video[0]} / Views : ${video[3]} / ${video[2]} ago`)}
        }
        img.setAttribute("id", "videoThumbnail")
        div.appendChild(img)
        div.classList.add("showVideo")
        div.addEventListener("click", () => {loadPlayer(video, info)})

        setTimeout(() => {div.classList.remove("showVideo")}, 400)
        infoVideosList.appendChild(div)
    }

}

function loadStreams(info, noContent) {
    infoStreamTitle.style.color = `rgb(${mainColor[0]-30}, ${mainColor[1]-30}, ${mainColor[2]-30})`
    for (let stream of info) {
        if (stream[1] === undefined && infoStreamList.hasChildNodes() === false) {
            const h1 = document.createElement("h1")
            if (lang.includes("ko")) {h1.innerText = "스트리밍을 하고있지 않아요"}
            else if (lang.includes("ja")) {h1.innerText = "ストリーミングしていません。"}
            else {h1.innerText = "No Stream :("}
            h1.setAttribute("id", "noStream")
            h1.classList.add("showStream")
            setTimeout(() => {h1.classList.remove("showStream")}, 400)
            infoStreamList.appendChild(h1)
            noContent.push("stream")
            break
        }
        const div = document.createElement("div")
        const img = document.createElement("img")
        div.setAttribute("id", "stream")
        img.setAttribute("src", getThumbnail(stream[1]))
        img.setAttribute("title", stream[0])
        img.setAttribute("id", "streamThumbnail")
        div.appendChild(img)
        div.addEventListener("click", () => {loadPlayer(stream, info)})
        div.classList.add("showStream")
        setTimeout(() => {div.classList.remove("showStream")}, 400)
        infoStreamList.appendChild(div)
    }
}

function loadCommunitys(info, noContent) {
    infoCommunityTitle.style.color = `rgb(${mainColor[0]-30}, ${mainColor[1]-30}, ${mainColor[2]-30})`
    if (info.length == 0 && infoCommunityList.hasChildNodes() === false) {
        const h1 = document.createElement("h1")
        if (lang.includes("ko")) {h1.innerText = "커뮤니티 게시글이 없어요"}
        else if (lang.includes("ja")) {h1.innerText = "コミュニティの投稿はありません。"}
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
        if (lang.includes("ko")) {div.setAttribute("title", `좋아요 : ${community[1]} / ${community[2]}`)}
        else if (lang.includes("ja")) {div.setAttribute("title", `いいね : ${community[1]} / ${community[2]}`)}
        else {div.setAttribute("title", `Likes : ${community[1]} / ${community[2]}`)}
        p.innerText = community[0]
        div.appendChild(p)
        div.classList.add("showCommunity")
        setTimeout(() => {div.classList.remove("showCommunity")}, 400)
        infoCommunityList.appendChild(div)
    }
}

function showInfo(info, channelId) {
    const mainJson = JSON.parse(localStorage["youtuber"])
    let noContent = []
    console.log(`Showing : ${channelId}`)
    const baseInfo = JSON.parse(mainJson[channelId])
    infoSubscriber.innerText = info["subscriber"]
    infoProfileLink.href = baseInfo["url"]
    infoChannelName.innerText = baseInfo["channelName"]
    if (lang.includes("ko")) {infoProfileImg.title = `${baseInfo["channelName"]} 채널로 이동`}
    else if (lang.includes("ja")) {infoProfileImg.title = `${baseInfo["channelName"]}のチャンネルに移動`}
    else {infoProfileImg.title = `Go to ${baseInfo["channelName"]}'s Channel`}
    infoProfileImg.src = baseInfo["profileImg"]
    const rgb = baseInfo["backgroundRgb"]
    changeBgColor(rgb)

    loadStreams(info["streams"], noContent)
    loadVideos(info["videos"], noContent)
    loadCommunitys(info["communitys"], noContent)

    const about = info["about"]
    if (lang.includes("ko")) {infoAbout.innerText = "채널 설명"}
    else if (lang.includes("ja")) {infoAbout.innerText = "チャンネルの説明"}
    else {infoAbout.innerText = "About Description"}

    infoAboutClass.style.display = "inline-block"
    infoSubscriber.style.visibility = "visible"
    infoChannelName.style.visibility = "visible"
    infoProfileImg.style.visibility = "visible"
    infoTotalView.innerText = about[3]
    infoLocation.innerText = locationFilter(about)
    infoJoinDate.innerText = about[2]
    infoAboutmore.innerText = about[0]
    if (infoAboutmore.innerText == "") {
        if (lang.includes("ko")) {infoAboutmore.innerText = "채널 설명이 없어요"}
        else if (lang.includes("ja")) {infoAboutmore.innerText = "チャンネルの説明はありません。"}
        else {infoAboutmore.innerText = "There is no Channel Description"}
    }

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
    if (showingTuber == channelId) {return 0}
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
    infoTuberLoading.style.display = "block"
    if (lang.includes("ko")) {infoTuberLoadingName.innerText = `${info["channelName"]} 로딩중...`}
    else if (lang.includes("ja")) {infoTuberLoadingName.innerText = `${info["channelName"]} ロード中...`}
    else {infoTuberLoadingName.innerText = `Loading ${info["channelName"]}...`}
    childProcess.exec(`${path.resolve(__dirname, "getInfo")} ${info["url"]} all`, (err, result) => {
        if (err) {
            handleError(err)
            return 0
        }

        const data = result.replace("b'", '').replace("'", '')
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
    if (loadingTuberList.length >= parseInt(settings["simultaneousLoadNumber"])) {
        console.log(`${channelId} : Refresh Canceled [simultaneousLoadNumber Limit]`)
    }
    if (showingTuber !== channelId || loadingTuber !== null) {
        console.log(`${channelId} : Refresh Canceled [Loading another Tuber: ${loadingTuber}]`)
        return null
    }
    console.log(`${channelId} : Refresh!`)
    loadingTuber = `Refreshing : ${channelId}`
    const mainJson = JSON.parse(localStorage["youtuber"])
    const info = JSON.parse(mainJson[channelId])
    let noContent = []
    childProcess.exec(`${path.resolve(__dirname, "getInfo")} ${info["url"]} all`, (err, result) => {
        if (err) {
            handleError(err)
            return 0
        }

        const data = result.replace("b'", '').replace("'", '')
        const buff = Buffer.from(data, "base64")
        let info = buff.toString("utf-8")
        info = JSON.parse(info)
        if (localStorage[channelId] == undefined) {console.log(`Refresh Canceled : Removed Tuber`); return null}
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
    if (!localStorage["recentTuber"] in Object.keys(mainJson)) {
        localStorage["recentTuber"] = Object.keys(mainJson)[0]
    }
    if (!Object.keys(JSON.parse(localStorage["youtuber"])).includes(localStorage["recentTuber"])) {localStorage["recentTuber"] = Object.keys(mainJson)[0]}

    if (localStorage["recentTuber"] === undefined || localStorage["recentTuber"] === "undefined") {
        if (Object.keys(mainJson) === "[]") {localStorage.removeItem("recentTuber"); return null}
        if (noList.style.display !== "none") {return null}
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
        console.log(`Preloading : ${channelName}`)
        childProcess.exec(`${path.resolve(__dirname, "getInfo")} ${JSON.parse(JSON.parse(localStorage["youtuber"])[channelName])["url"]} all`, (err, result) => {
            if (err) {
                handleError(err)
                return 0
            }
    
            const data = result.replace("b'", '').replace("'", '')
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
        if (rgb === null) {body.setAttribute("style", `background-color: tomato !important;`); mainColor = [255, 99, 71]}
        else {body.setAttribute("style", `background: rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]}) !important;`); mainColor = rgb}
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
    tuberListContainer.style.pointerEvents = "none"
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
        tuberListContainer.style.pointerEvents = "all"
    }, 250)
})

removeButtonImg.addEventListener("click", () => {
    removeTuberPopup.style.display = "block"
    tuberListContainer.style.pointerEvents = "none"
    removeTuberPopup.classList.remove("hidePopup")
    removeTuberPopup.classList.add("showPopup")
    removeTuber()
})

removeTuberPopupExit.addEventListener("click", () => {
    removeTuberPopup.classList.remove("addPopup")
    removeTuberPopup.classList.add("hidePopup")
    setTimeout(() => {
        removeTuberPopup.style.display = "none"
        tuberListContainer.style.pointerEvents = "all"
    }, 250)
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

export { removeTuber, loadList, lang, mainColor, tuberListContainer }
export default addTuber