const { PythonShell } = require("python-shell")
const os = require('os')
const fs = require("fs")

const body = document.querySelector("body")
const addButtonImg = document.querySelector("#addButtonImg")
const addTuberPopup = document.querySelector(".addTuberPopup")
const addTuberPopupForm = document.querySelector("#addTuberPopupForm")
const addTuberPopupInput = document.querySelector("#addTuberPopupForm input")
const addTuberPopupExit = document.querySelector("#addTuberPopupExit")
const tuberListContainer = document.querySelector("#tuberList")
const infoProfileImg = document.querySelector("#infoProfileImg a img")
const infoProfileLink = document.querySelector("#infoProfileImg a")
const infoChannelName = document.querySelector("#infoChannelName h1")
const infoSubscriber = document.querySelector("#infoSubscriber")
const noList = document.querySelector("#noList")
const addTuberLoading = document.querySelector("#addTuberLoading")
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
const infoVideosTitle = document.querySelector("#infoVideosTitle")

/*globalInterval은 현재 정보가 표시된 유튜버의 자동새로고침 함수
loadingTuber는 현재 로딩상태, null이 아니면 함수실행중지*/

const rootPath = "C:\\Users\\태영\\Desktop\\YourFavorite\\"
const driverPath = `${rootPath}resource\\driver`
/*const rootPath = "C:\\Program Files\\YourFavorite Preview\\resources\\app\\"*/
if (fs.existsSync(rootPath) == false) {
    rootPath = `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Programs\\YourFavorite Preview\\resources\\app\\`
}

let globalInterval = null
let loadingTuber = null
let showingTuber = null
let pythonPath = `${rootPath}resource\\python-3.9.8.amd64\\python.exe`

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
    let channelName, profileImg;

    addTuberPopupInput.value = ""
    PythonShell.run(rootPath+"getInfo.py", option, (error, result) => {
        if (error) {
            console.log(error)
        }

        const data = result[0].replace("b'", '').replace("'", '')
        const buff = Buffer.from(data, "base64")
        const info = buff.toString("utf-8").split("::")

        channelName = info[0]
        profileImg = info[1]
        const json = {
            "channelName": channelName,
            "profileImg": profileImg,
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

function showInfo(info, channelId) {
    const mainJson = JSON.parse(localStorage["youtuber"])
    let noContent = []
    console.log(`Showing : ${channelId}`)
    const baseInfo = JSON.parse(mainJson[channelId])
    infoSubscriber.innerText = info["subscriber"]
    infoProfileLink.href = baseInfo["url"]
    infoChannelName.innerText = baseInfo["channelName"]
    infoProfileImg.title = `${baseInfo["channelName"]}채널로 이동`
    infoProfileImg.src = baseInfo["profileImg"]

    for (let stream of info["streams"]) {
        if (stream[1] === undefined && infoStreamList.hasChildNodes() === false) {
            const h1 = document.createElement("h1")
            h1.innerText = "스트리밍을 하고있지 않아요"
            h1.setAttribute("id", "noStream")
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

    for (let video of info["videos"]) {
        if (video[1] === undefined && infoVideosList.hasChildNodes() === false) {
            const h1 = document.createElement("h1")
            h1.innerText = "올린 영상이 없어요"
            h1.setAttribute("id", "noVideo")
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
        img.setAttribute("title", `${video[0]} / 조회수 : ${video[3]} / ${video[2]} 전`)
        img.setAttribute("id", "videoThumbnail")
        a.appendChild(img)
        div.appendChild(a)
        div.classList.add("showVideo")
        setTimeout(() => {div.classList.remove("showVideo")}, 400)
        infoVideosList.appendChild(div)
    }

    if (info["communitys"].length == 0 && infoCommunityList.hasChildNodes() === false) {
        const h1 = document.createElement("h1")
        h1.innerText = "커뮤니티 게시글이 없어요"
        h1.setAttribute("id", "noCommunity")
        infoCommunityList.appendChild(h1)
        noContent.push("community")
    }
    for (let community of info["communitys"]) {
        const div = document.createElement("div")
        const p = document.createElement("p")
        div.setAttribute("id", "community")
        div.setAttribute("title", `좋아요 : ${community[1]} / ${community[2]}`)
        p.innerText = community[0]
        div.appendChild(p)
        div.classList.add("showCommunity")
        setTimeout(() => {div.classList.remove("showCommunity")}, 400)
        infoCommunityList.appendChild(div)
    }

    const about = info["about"]
    infoAbout.innerText = about[0]
    if (infoAbout.innerText.length > 15) {
        infoAbout.innerText = `${infoAbout.innerText.substr(0, 15)}...`
    }

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
        infoVideosTitle.classList.add("onlyVideosTitle")
        for (let video of document.querySelectorAll("#video")) {video.classList.add("onlyVideo")}
    } else {
        infoCommunity.style.display = "block"
        infoStream.style.display = "block"
        infoVideos.classList.remove("onlyVideos")
        infoVideosList.classList.remove("onlyVideosList")
        infoVideosTitle.classList.remove("onlyVideosTitle")
        for (let video of document.querySelectorAll("#video")) {video.classList.remove("onlyVideo")}
    }

    globalInterval = setInterval(autoRefresh, 10000, channelId)
    loadingTuber = null
    showingTuber = channelId
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

    const mainJson = JSON.parse(localStorage["youtuber"])
    const info = JSON.parse(mainJson[channelId])
    option.args = [info["url"], "all"]
    infoTuberLoading.style.display = "block"
    infoTuberLoadingName.innerText = `${info["channelName"]} 로딩중...`
    PythonShell.run(rootPath+"getInfo.py", option, (error, result) => {
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
        localStorage[channelId] = JSON.stringify(info)

    })
    if (showingTuber !== channelId) {
        return null
    }
    if (localStorage[channelId] !== undefined) {showInfo(JSON.parse(localStorage[channelId]), channelId)}
}

function autoRefresh(channelId) {
    if (showingTuber !== channelId || loadingTuber !== null) {
        console.log(`${channelId} : Refresh Canceled [다른 유튜버 로딩중 : ${loadingTuber}]`)
        return null
    }
    console.log(`${channelId} : Refresh!`)
    loadingTuber = `Refreshing : ${channelId}`
    PythonShell.run(rootPath+"getInfo.py", option, (error, result) => {
        if (error) {
            console.log(error)
        }

        const data = result[0].replace("b'", '').replace("'", '')
        const buff = Buffer.from(data, "base64")
        let info = buff.toString("utf-8")
        info = JSON.parse(info)
        let oldinfo = JSON.parse(localStorage[channelId])
        if (oldinfo === undefined) {oldinfo = JSON.parse(JSON.stringify(info))}
        let noContent = []

        if (loadingTuber !== `Refreshing : ${channelId}`) {
            console.log(`${channelId} : Refresh Saved [${loadingTuber}]`)
            localStorage[channelId] = JSON.stringify(info)
            return null
        }

        infoSubscriber.innerText = info["subscriber"]

        for (let stream of info["streams"].filter(x => {!oldinfo["streams"].includes(x)})) {
            if (stream[1] === undefined) {
                while (infoStreamList.hasChildNodes()) {
                    infoStreamList.removeChild(infoStreamList.firstChild)
                }
                const h1 = document.createElement("h1")
                h1.innerText = "스트리밍을 하고있지 않아요"
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
            infoStreamList.appendChild(div)
        }

        for (let video of info["videos"].filter(x => {!oldinfo["videos"].includes(x)})) {
            if (video[1] === undefined) {
                while (infoVideosList.hasChildNodes()) {
                    infoVideosList.removeChild(infoVideosList.firstChild)
                }
                const h1 = document.createElement("h1")
                h1.innerText = "올린 영상이 없어요"
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
            img.setAttribute("title", `${video[0]} / 조회수 : ${video[3]} / ${video[2]} 전`)
            img.setAttribute("id", "videoThumbnail")
            a.appendChild(img)
            div.appendChild(a)
            infoVideosList.appendChild(div)
        }

        for (let community of info["communitys"].filter(x => {!oldinfo["communitys"].includes(x)})) {
            if (community[0] === undefined) {
                while (infoCommunityList.hasChildNodes()) {
                    infoCommunityList.removeChild(infoCommunityList.firstChild)
                }
                const h1 = document.createElement("h1")
                h1.innerText = "커뮤니티 게시글이 없어요"
                h1.setAttribute("id", "noCommunity")
                infoCommunityList.appendChild(h1)
                noContent.push("community")
                break
            }
            const div = document.createElement("div")
            const p = document.createElement("p")
            div.setAttribute("id", "community")
            div.setAttribute("title", `좋아요 : ${community[1]} / ${community[2]}`)
            p.innerText = community[0]
            div.appendChild(p)
            infoCommunityList.appendChild(div)
        }

        const about = info["about"]
        infoAbout.innerText = about[0]
        if (infoAbout.innerText.length > 10) {
            infoAbout.innerText = `${infoAbout.innerText.substr(0, 10)}...`
        }
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
            infoVideosTitle.classList.add("onlyVideosTitle")
            for (let video of document.querySelectorAll("#video")) {video.classList.add("onlyVideo")}
        } else {
            infoCommunity.style.display = "block"
            infoStream.style.display = "block"
            infoVideos.classList.remove("onlyVideos")
            infoVideosList.classList.remove("onlyVideosList")
            infoVideosTitle.classList.remove("onlyVideosTitle")
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
    if (localStorage["youtuber"].length <= 2 && showingTuber === null) { //youtuber JSON이 비어있는지 판단
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
addTuberPopupForm.addEventListener("submit", addTuber)
infoAboutMoreButton.addEventListener("click", showMoreAbout)
infoAboutMorePopupExitButton.addEventListener("click", () => {
    infoAboutMorePopup.classList.remove("addPopup")
    infoAboutMorePopup.classList.add("hidePopup")
    setTimeout(() => {infoAboutMorePopup.style.display = "none"}, 250)
})

clearInfo()
loadList()
toggleNoList()
setTimeout(showRecentTuber, 500)