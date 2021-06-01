const warnings = require("./en-US.json")


module.exports = {
    warnings,
    showWarning(key) {
        if (Object.keys(warnings).includes(key)) {
            console.error(warnings[key].join("\n"))
        }
    }
}