const { randomInt } = require("crypto")

module.exports = {
    perms: 0, // 0 = anyone can use
    aliases: ["ahole","roast"],
    name: "insult",
    insults:[
        "@{user} grow up.",
        "@{user} smells like sawdust.",
        "@{user} needs to stop talking. right now. im getting pissed.",
        "@{user} you built like a big mac.",
        "@{user} get yo money up not yo funny up.",
        "@{user} more like... dumb!!! lmao!!",
        "@{user} likes lil yachty. what a loser. #lilyachtyhategang"
    ],
    /**
     * @param {string} cChan
     * @param {import("tmi.js").ChatUserstate} cState
     * @param {string} cMsg
     */
    async func (cChan, cState, cMsg) {
        var splitMsg = cMsg.split(" ")
        if (splitMsg[0] != undefined && splitMsg[0] != "") {
            return this.insults[randomInt(this.insults.length)].replace("{user}",splitMsg[0])
        }
        return this.insults[randomInt(this.insults.length)].replace("{user}",cState["display-name"])
    }
}