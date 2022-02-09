const { PythonShell } = require("python-shell")
const ColorThief = require('colorthief');
const os = require('os')
const fs = require("fs")

const body = document.querySelector("body")
const addButtonImg = document.querySelector("#addButtonImg")
const addTuberPopup = document.querySelector(".addTuberPopup")
const addTuberPopupFormUrl = document.querySelector("#addTuberPopupFormUrl")
const addTuberPopupInput = document.querySelector("#addTuberPopupFormUrl input")
const addTuberPopupExit = document.querySelector("#addTuberPopupExit")
const tuberListContainer = document.querySelector("#tuberList")
const infoProfileImg = document.querySelector("#infoProfileImg a img")
const infoProfileLink = document.querySelector("#infoProfileImg a")
const infoChannelName = document.querySelector("#infoChannelName h1")
const infoSubscriber = document.querySelector("#infoSubscriber")
const noList = document.querySelector("#noList")
const infoAboutMoreButton = document.querySelector("#infoAboutMoreButton img")
const infoAboutMorePopup = document.querySelector("#infoAboutMorePopup")
const infoAboutMorePopupExitButton = document.querySelector("#infoAboutMorePopupExitButton")
const infoStreamList = document.querySelector("#infoStreamList")
const infoVideosList = document.querySelector("#infoVideosList")
const infoCommunityList = document.querySelector("#infoCommunityList")
const infoAbout = document.querySelector("#infoAbout")
const infoTotalView = document.querySelector("#infoTotalView")
const infoLocation = document.querySelector("#infoLocation")
const infoJoinDate = document.querySelector("#infoJoinDate")
const infoAboutmore = document.querySelector("#infoAboutmore")
const infoRoot = document.querySelector(".infoRoot")
const removeButtonImg = document.querySelector("#removeButtonImg")
const removeTuberPopup = document.querySelector(".removeTuberPopup")
const removeTuberPopupExit = document.querySelector("#removeTuberPopupExit")
const removeTuberPopupList = document.querySelector("#removeTuberPopupList")
const infoTuberLoading = document.querySelector("#infoTuberLoading")
const infoTuberLoadingName = document.querySelector("#infoTuberLoading h2")
const infoStream = document.querySelector(".infoStream")
const infoCommunity = document.querySelector(".infoCommunity")
const infoVideos = document.querySelector(".infoVideos")
const infoAboutClass = document.querySelector(".infoAbout")
const infoLocationRoot = document.querySelector("#infoLocationRoot")
const infoVideoTitle = document.querySelector("#infoVideoTitle")
const infoCommunityTitle = document.querySelector("#infoCommunityTitle h2")
const infoStreamTitle = document.querySelector("#infoStreamTitle h2")
const addTuberPopupFormFileInput = document.querySelector("#addTuberPopupFormFileInput")

/*globalInterval은 현재 정보가 표시된 유튜버의 자동새로고침 함수
loadingTuber는 현재 로딩상태, null이 아니면 함수실행중지*/

let rootPath = fs.readFileSync(`${__dirname}/../js/path`, "utf8")
let settingPath = `${rootPath}/resource/setting.json`
let settings = JSON.parse(fs.readFileSync(settingPath, "utf8"))
const lang = Intl.DateTimeFormat().resolvedOptions().locale

let globalInterval = null
let loadingTuber = null
let showingTuber = null
let mainColor = null
let loadedTuberList = []
let loadingTuberList = []
let pythonPath = `${rootPath}/resource/python-3.9.10.amd64/python.exe`

const option = {
    mode: "text",
    pythonPath: pythonPath,
    pythonOptions: ["-u"],
    scriptPath: "",
    encoding: "utf8"
}

function loadList() {
    if (localStorage["youtuber"] === undefined) {return null}
    const mainJson = JSON.parse(localStorage["youtuber"])
    for (let key of Object.keys(mainJson)) {
        addList(key)
    }
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

    addTuberPopupInput.value = ""
    PythonShell.run(rootPath+"/getInfo.py", option, (error, result) => {
        if (error) {
            console.log(error)
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
        .catch(err => {console.log(`Color-Thief Error : ${err}`)})
    })
}

function addPackage(event) {
    event.preventDefault()
    const reader = new FileReader
    reader.onload = () => {
        try {
            const pack = JSON.parse(reader.result)   
        } catch (error) {
            console.log(error)
        }
        setTimeout(() => {addTuberPopupFormFileInput.value = ""}, 2000)
    }
    reader.readAsText(addTuberPopupFormFileInput.files[0], "utf-8")
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
    PythonShell.run(rootPath+"/getInfo.py", option, (error, result) => {
        if (error) {
            console.log(error)
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
    PythonShell.run(rootPath+"/getInfo.py", option, (error, result) => {
        if (error) {
            console.log(error)
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
        PythonShell.run(rootPath+"/getInfo.py", option, (error, result) => {
            if (error) {
                console.log(error)
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
addButtonImg.addEventListener("click", () => {
    addTuberPopup.style.display = "block"
    addTuberPopup.classList.remove("hidePopup")
    addTuberPopup.classList.add("showPopup")
})
addTuberPopupExit.addEventListener("click", () => {
    addTuberPopup.classList.remove("addPopup")
    addTuberPopup.classList.add("hidePopup")
    setTimeout(() => {addTuberPopup.style.display = "none"}, 250)
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
addTuberPopupFormFileInput.addEventListener("change", addPackage)
infoAboutMoreButton.addEventListener("click", showMoreAbout)
infoAboutMorePopupExitButton.addEventListener("click", () => {
    infoAboutMorePopup.classList.remove("addPopup")
    infoAboutMorePopup.classList.add("hidePopup")
    setTimeout(() => {infoAboutMorePopup.style.display = "none"}, 250)
})
window.addEventListener("resize", () => {
    document.querySelector("html").style.fontSize = `${16 * (window.innerHeight/1080)}px`
    console.log(document.querySelector("html").style.fontSize)
})

const loading = document.querySelector(".loading")
window.onload = () => {
    clearInfo()
    loadList()
    toggleNoList()
    setTimeout(showRecentTuber, 500)
    setTimeout(autoPreload, 1500)
    setInterval(autoPreload, settings["preloadDelay"][0])
    changeBgColor()
    setTimeout(() => {
        loading.classList.add("hideLoading")
        setTimeout(() => {loading.style.display = "none"}, 1000)
    }, 1500)
}