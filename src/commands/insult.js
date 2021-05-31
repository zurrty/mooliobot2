module.exports = {
    perms: 0, // 0 = anyone can use
    aliases: ["ahole","roast"],
    name: "insult",
    /**
     * @param {string} cChan
     * @param {import("tmi.js").ChatUserstate} cState
     * @param {string} cMsg
     */
    func: async (cChan, cState, cMsg) => {
        const insults = ["{user}, grow up.", ""]
        var splitMsg = cMsg.split(" ")
        console.log(cMsg)

        return `@${cState["username"]} loser!`
    }
}