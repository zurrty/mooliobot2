const { readdirSync } = require("fs")

function loadCommands() {
    return readdirSync(__dirname).filter((file) => {
        if (file.search(".js") != -1) {
            if (file == "index.js") {
                return false
            }
            return true
        }
        return false
    })
}


module.exports = {
    loadCommands
}