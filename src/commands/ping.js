module.exports = {
    perms: 0, // 0 = anyone can use
    aliases: ["test","areyoualive"],
    name: "ping",
    /**
     * @param {string} cChan
     * @param {import("tmi.js").ChatUserstate} cState
     * @param {string} cMsg
     */
    func: async (cChan, cState, cMsg) => {
        return `@${cState["display-name"]}, yo im alive`
    }
}