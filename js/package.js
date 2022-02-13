const { ipcRenderer } = require("electron")

const url  = "https://raw.githubusercontent.com/cottons-kr/yf-archive/main/"

function handleError(msg) {
    console.log(msg)
    ipcRenderer.invoke("showMessage", "패키지 오류!", "올바른 형식의 패키지가 아니에요", "warning")
}

export default function addPackageFile(event) {
    event.preventDefault()
    const reader = new FileReader
    reader.onload = () => {
        try {
            const pack = JSON.parse(reader.result)   
        } catch (error) {
            handleError(error)
        }
        setTimeout(() => {addTuberPopupFormFileInput.value = ""}, 2000)
    }
    reader.readAsText(addTuberPopupFormFileInput.files[0], "utf-8")
}

export function showPackage() {
    fetch("https://raw.githubusercontent.com/cottons-kr/yf-archive/main/packages.json").then(res => res.json())
    .then(data => {
        ;
    })
}