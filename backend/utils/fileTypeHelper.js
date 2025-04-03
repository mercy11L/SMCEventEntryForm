const path=require("path");
function getFileType(fileName) {
    return path.extname(fileName).toLowerCase().replace(".", "");
}
module.exports = { getFileType };