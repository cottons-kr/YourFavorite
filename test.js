const childProcess = require("child_process")
const res = childProcess.execSync("./dist/getInfo https://www.youtube.com/sbs8nsdews simple debug")
console.log(res.toString())