const { PythonShell } = require("python-shell")
const { info } = require("console")
const { app } = require("electron")
const os = require('os')
const fs = require("fs")

const addButtonImg = document.querySelector("#addButtonImg")
const addTuberPopup = document.querySelector(".addTuberPopup")
const addTuberPopupForm = document.querySelector("#addTuberPopupForm")
const addTuberPopupInput = document.querySelector("#addTuberPopupForm input")
const addTuberPopupExit = document.querySelector("#addTuberPopupExit")
const tuberListContainer = document.querySelector("#tuberList")
const infoProfileImg = document.querySelector("#infoProfileImg img")
const infoChannelName = document.querySelector("#infoChannelName h1")
const infoSubscriber = document.querySelector("#infoSubscriber")
const noList = document.querySelector("#noList")
const addTuberLoading = document.querySelector("#addTuberLoading")
const infoAboutMoreButton = document.querySelector("#infoAboutMoreButton")
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
const infoAboutImg = document.querySelector("#infoAboutImg")
const infoTotalViewImg = document.querySelector("#infoTotalViewImg")
const infoLocationImg = document.querySelector("#infoLocationImg")
const infoJoinDateImg = document.querySelector("#infoJoinDateImg")
const infoRoot = document.querySelector(".infoRoot")
const pleaseSelect = document.querySelector("#pleaseSelect")
const programExitButton = document.querySelector("#programExitButton")
const removeButtonImg = document.querySelector("#removeButtonImg")
const removeTuberPopup = document.querySelector(".removeTuberPopup")
const removeTuberPopupExit = document.querySelector("#removeTuberPopupExit")
const removeTuberPopupList = document.querySelector("#removeTuberPopupList")

/*globalInterval은 현재 정보가 표시된 유튜버의 자동새로고침 함수
loadingTuber는 현재 로딩상태, null이 아니면 함수실행중지*/
/*const rootPath = "C:\\Program Files\\YourFavorite Preview\\resources\\app\\"*/
const rootPath = "C:\\Users\\태영\\Desktop\\YourFavorite\\"
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
    channelButton.addEventListener("click", () => {showInfo(channelId)})
    h2.innerText = info["channelName"]

    listProfileImg.appendChild(img)
    listChannelName.appendChild(h2)
    channel.appendChild(listProfileImg)
    channel.appendChild(listChannelName)
    channelButton.appendChild(channel)
    tuberListContainer.appendChild(channelButton)
    toggleNoList()
}

/*
subscriber = info[0]
channelName = info[1]
profileImg = info[2]
*/

function addTuber(event) {
    event.preventDefault()
    const url = addTuberPopupInput.value
    option.args = [url, "simple"]
    let channelName, profileImg;

    addTuberPopupInput.value = ""
    addTuberPopupForm.style.display = "none"
    addTuberLoading.style.display = "block"
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

        addTuberPopupForm.style.display = "block"
        addTuberLoading.style.display = "none"
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
            button.addEventListener("click", () => {
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
            })
            removeTuberPopupList.appendChild(button)
        }
        toggleNoList()
    }
}

function showInfo(channelId) {
    if (loadingTuber !== null) {
        return null
    }
    loadingTuber = channelId
    showingTuber = channelId
    if (globalInterval !== null) {
        clearInterval(globalInterval)
    }

    infoSubscriber.innerText = ""
    infoChannelName.innerText = ""
    infoProfileImg.src = ""
    clearInfo()

    const mainJson = JSON.parse(localStorage["youtuber"])
    const info = JSON.parse(mainJson[channelId])
    infoProfileImg.src = info["profileImg"]
    infoChannelName.innerText = info["channelName"]
    option.args = [info["url"], "all"]
    pleaseSelect.style.display = "none"
    infoRoot.style.display = "flex"
    PythonShell.run(rootPath+"getInfo.py", option, (error, result) => {
        if (error) {
            console.log(error)
        }
        if (loadingTuber !== channelId) {
            return null
        }

        const data = result[0].replace("b'", '').replace("'", '')
        const buff = Buffer.from(data, "base64")
        let info = buff.toString("utf-8")
        info = JSON.parse(info)
        
        infoSubscriber.innerText = info["subscriber"]

        for (let stream of info["streams"]) {
            if (stream[1] === undefined) {
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

        for (let video of info["videos"]) {
            if (video[1] === undefined) {
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

        for (let community of info["communitys"]) {
            if (community[0] === undefined) {
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
        infoJoinDateImg.style.visibility = "visible"
        infoLocationImg.style.visibility = "visible"
        infoTotalViewImg.style.visibility = "visible"
        infoAboutImg.style.visibility = "visible"

        infoTotalView.innerText = about[3]
        infoLocation.innerText = about[1]
        infoJoinDate.innerText = about[2]
        infoAboutmore.innerText = about[0]
        globalInterval = setInterval(autoRefresh, 30000)
        loadingTuber = null
    })
}

function autoRefresh() {
    if (showingTuber === null) {
        return null
    }
    console.log("Refresh!")
    PythonShell.run(rootPath+"getInfo.py", option, (error, result) => {
        if (error) {
            console.log(error)
        }

        const data = result[0].replace("b'", '').replace("'", '')
        const buff = Buffer.from(data, "base64")
        let info = buff.toString("utf-8")
        info = JSON.parse(info)

        while (infoStreamList.hasChildNodes()) {
            infoStreamList.removeChild(infoStreamList.firstChild)
        }
        while (infoVideosList.hasChildNodes()) {
            infoVideosList.removeChild(infoVideosList.firstChild)
        }
        while (infoCommunityList.hasChildNodes()) {
            infoCommunityList.removeChild(infoCommunityList.firstChild)
        }
        
        infoSubscriber.innerText = info["subscriber"]

        for (let stream of info["streams"]) {
            if (stream[1] === undefined) {
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

        for (let video of info["videos"]) {
            if (video[1] === undefined) {
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

        for (let community of info["communitys"]) {
            if (community[0] === undefined) {
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
        infoLocation.innerText = about[1]
        infoJoinDate.innerText = about[2]
        infoAboutmore.innerText = about[0]
    })
}

function clearInfo() {
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
    infoTotalView.innerText = ""
    infoLocation.innerText = ""
    infoJoinDate.innerText = ""
    infoAboutmore.innerText = ""
    infoAbout.innerText = ""

    infoAboutImg.style.visibility = "hidden"
    infoTotalViewImg.style.visibility = "hidden"
    infoLocationImg.style.visibility = "hidden"
    infoJoinDateImg.style.visibility = "hidden"
    showingTuber = null
}

function toggleNoList() {
    if (localStorage["youtuber"] === undefined) {localStorage["youtuber"] = "{}"}
    if (localStorage["youtuber"].length <= 2 && showingTuber === null) { //youtuber JSON이 비어있는지 판단
        noList.style.display = "block"
        pleaseSelect.style.display = "none"
    } else {
        noList.style.display = "none"
    }

    if (showingTuber === null && noList.style.display === "none") {
        pleaseSelect.style.display = "block"
    } else {
        pleaseSelect.style.display = "none"
    }
}

function getThumbnail(url) {
    return (`https://i.ytimg.com/vi/${url.replace(/^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/g,"$1")}/original.jpg`)
}

function getAverageRGB(imgEl) {
    let blockSize = 5, 
        defaultRGB = {r:0,g:0,b:0},
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;
    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        return defaultRGB;
    }

    length = data.data.length;
    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }

    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);
    return rgb;
}

function showMoreAbout() {
    infoAboutMorePopup.style.display = "block"
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
    addTuberPopup.style.visibility = "visible"
})
addTuberPopupExit.addEventListener("click", () => {
    addTuberPopup.style.visibility = "hidden"
})
removeButtonImg.addEventListener("click", () => {
    removeTuberPopup.style.visibility = "visible"
    removeTuber()
})
removeTuberPopupExit.addEventListener("click", () => {
    removeTuberPopup.style.visibility = "hidden"
})
addTuberPopupForm.addEventListener("submit", addTuber)
infoAboutMoreButton.addEventListener("click", showMoreAbout)
infoAboutMorePopupExitButton.addEventListener("click", () => {
    infoAboutMorePopup.style.display = "none"
})
programExitButton.addEventListener("click", () => {
    window.close()
})

clearInfo()
loadList()
toggleNoList()
