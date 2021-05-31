const { randomInt } = require("crypto")

module.exports = {
    perms: 0, // 0 = anyone can use
    aliases: ["kramerquote","kramer","randomkramer"],
    name: "rkq",
    /**
     * @param {string} cChan
     * @param {import("tmi.js").ChatUserstate} cState
     * @param {string} cMsg
     */
    func: async (cChan, cState, cMsg) => {
        const quotes = require("../../client/command-data/kramer-quotes.json")
        return `@${cState["display-name"]}, ${quotes[randomInt(quotes.length)]}`
    }
}