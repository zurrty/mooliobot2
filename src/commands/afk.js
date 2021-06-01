const { setUserValue } = require("../UserManagement")

module.exports = {
    perms: 0, // 0 = anyone can use
    description: "leave. go away.",
    aliases: ["bye","ppPoof","shit","poop","piss","pee","eat","dinner","breakfast","lunch","gn","sleep","bed","bedtime","school","study","work"],
    name: "afk",
    /**
     * @param {string} cChan
     * @param {import("tmi.js").ChatUserstate} cState
     * @param {string} cMsg
     */
    func: async (cChan, cState, cMsg, cCmd) => {
        let date = Date.now()
        switch (cCmd) {
            case "shit":
            case "poop": {
                setUserValue(cState["user-id"], ["afk"], {type:"poop",time:date,msg:cMsg})
                return `@${cState["display-name"]} is now pooping.`
            }
            case "piss":
            case "pee": {
                setUserValue(cState["user-id"], ["afk"], {type:"pee",time:date,msg:cMsg})
                return `@${cState["display-name"]} is taking a pee break.`
            }
            case "eat":
            case "dinner":
            case "breakfast":
            case "lunch": {
                setUserValue(cState["user-id"], ["afk"], {type:"food",time:date,msg:cMsg})
                return `@${cState["display-name"]} is getting food.`
            }
            case "gn":
            case "sleep":
            case "bed":
            case "bedtime": {
                setUserValue(cState["user-id"], ["afk"], {type:"sleep",time:date,msg:cMsg})
                return `@${cState["display-name"]} is going to bed.`
            }
            default: {
                setUserValue(cState["user-id"], ["afk"], {type:"afk",time:date,msg:cMsg})
                return `@${cState["display-name"]} will be right back.`
            }
        }
    }
}