const childProcess = require("child_process")
const res = childProcess.execSync("./dist/getInfo https://www.youtube.com/sbs8news all debug")
console.log(JSON.parse(res.toString()))