module.exports = {
    perms: 0, // 0 = anyone can use
    aliases: ["commands"],
    name: "help",
    /**
     * @param {string} cChan
     * @param {import("tmi.js").ChatUserstate} cState
     * @param {string} cMsg
     */
    func: async (cChan, cState, cMsg) => {
        return `@${cState["display-name"]}, https://github.com/zurrty/mooliobot2/blob/master/commands.md`
    }
}