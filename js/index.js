const { PythonShell } = require("python-shell")
const os = require('os');
const { info } = require("console");

const addButton = document.querySelector("#addButtonImg")
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
const infoStreamContainer = document.querySelector(".infoStream")
const infoStream = document.querySelector(".infoStream li")
const infoAbout = document.querySelector("#infoAbout")
const infoAboutMoreButton = document.querySelector("#infoAboutMoreButton")
const infoAboutMorePopup = document.querySelector("#infoAboutMorePopup")
const infoAboutMorePopupExitButton = document.querySelector("#infoAboutMorePopupExitButton")

const userName = os.userInfo().username
const pythonPath = `C:\\Users\\${userName}\\AppData\\Local\\Programs\\Python\\Python310\\python.exe`
const option = {
    mode: "text",
    pythonPath: pythonPath,
    pythonOptions: ["-u"],
    scriptPath: "",
    encoding: "utf8"
}

function loadList(){
    for(let i = 0; i < localStorage.length; i++){
        addList(i)
     }
}

function addList(number) {
    let info = localStorage.getItem(localStorage.key(number.toString()))
    info = JSON.parse(info)

    const channel = document.createElement("div")
    const channelButton = document.createElement("button")
    const listProfileImg = document.createElement("div")
    const listChannelName = document.createElement("div")
    const img = document.createElement("img")
    const p = document.createElement("p")

    channel.setAttribute("id", info["channelName"])
    listProfileImg.setAttribute("id", "listProfileImg")
    listChannelName.setAttribute("id", "listChannelName")
    img.setAttribute("src", info["profileImg"])
    channelButton.setAttribute("id", "channelButton")
    channelButton.addEventListener("click", () => {showInfo(number)})
    p.innerText = info["channelName"]

    listProfileImg.appendChild(img)
    listChannelName.appendChild(p)
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
    console.log(option)
    let channelName, profileImg;

    addTuberPopupInput.value = ""
    addTuberPopupForm.style.display = "none"
    addTuberLoading.style.display = "block"
    PythonShell.run("getInfo.py", option, (error, result) => {
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
        const number = localStorage.length
        localStorage.setItem(number, JSON.stringify(json))
        addList(number)

        addTuberPopupForm.style.display = "block"
        addTuberLoading.style.display = "none"
    })
}

function showInfo(number) {
    infoSubscriber.innerText = ""
    //infoLoading.style.display = "block"
    let info = localStorage.getItem(localStorage.key(number.toString()))
    info = JSON.parse(info)
    infoProfileImg.src = info["profileImg"]
    infoChannelName.innerText = info["channelName"]
    option.args = [info["url"], "all"]
    PythonShell.run("getInfo.py", option, (error, result) => {
        if (error) {
            console.log(error)
        }

        const data = result[0].replace("b'", '').replace("'", '')
        const buff = Buffer.from(data, "base64")
        let info = buff.toString("utf-8")
        info = JSON.parse(info)
        
        infoSubscriber.innerText = info["subscriber"]

        if (info["stream"] !== "CantLoad") {
            for (let stream of info["streams"]) {
                const div = document.createElement("div")
                const img = document.createElement("img")
                const span = document.createElement("span")
                const a = document.createElement("a")
                a.setAttribute("href", stream[1])
                a.setAttribute("id", "stream")
                img.setAttribute("src", getThumbnail(stream[1]))
                span.innerText = stream[0]
                span.style.display = "none"
                div.appendChild(img)
                div.appendChild(span)
                a.appendChild(div)
                infoStream.appendChild(a)
            }
            infoStreamContainer.style.display = "block"
        }
    })
}

function toggleNoList() {
    if (noList.style.display !== "none" && localStorage.length !== 0) {
        noList.style.display = "none"
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

addButton.addEventListener("mouseover", () => {
    addButton.style.opacity = 1
})
addButton.addEventListener("mouseout", () => {
    addButton.style.opacity = 0.1
})
addButton.addEventListener("click", () => {
    addTuberPopup.style.visibility = "visible"
})
addTuberPopupExit.addEventListener("click", () => {
    addTuberPopup.style.visibility = "hidden"
})
addTuberPopupForm.addEventListener("submit", addTuber)
infoAboutMoreButton.addEventListener("click", showMoreAbout)
infoAboutMorePopupExitButton.addEventListener("click", () => {
    infoAboutMorePopup.style.display = "none"
})

loadList()
if (infoAbout.innerText.length >= 10) {
    infoAbout.innerText = `${infoAbout.innerText.substr(0, 20)}...`
}
