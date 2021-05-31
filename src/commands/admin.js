const ChatBot = require("..").chat_bot
const {join} = require("path")
const {writeFileSync} = require("fs")
module.exports = {
    perms: 0, // 0 = anyone can use
    aliases: null,
    name: "admin",
    /**
     * @param {string} cChan
     * @param {import("tmi.js").ChatUserstate} cState
     * @param {string} cMsg
     */
    func: async (cChan, cState, cMsg) => {
        if (cState["user-id"] == "191753381") {
            const splitMsg = cMsg.split(" ")
            switch (splitMsg[0]) {
                case "reload":
                    ChatBot.reloadCommands()
                    return `@${cState["display-name"]}, Reloaded commands`
                    break;
                case "join": {
                        if (splitMsg[1] == undefined || splitMsg[1] == "") {
                            return `@${cState["display-name"]}, Please provide a channel name`
                        }
                        let channels = ChatBot.client.getChannels().map(val => {return val.replace("#","")})
                        if(channels.includes(splitMsg[1].toLowerCase())) {
                            return `@${cState["display-name"]}, I'm already there...`
                        }
                        channels.push(splitMsg[1].toLowerCase())
                        writeFileSync(join(__dirname, "../../client/channels.txt"), channels.join("\n"))
                        ChatBot.client.join(splitMsg[1].toLowerCase())
                        return `@${cState["display-name"]}, Joined channel "${splitMsg[1]}"`
                    }
                    
                case "leave": {
                    if (splitMsg[1] == undefined || splitMsg[1] == "") {
                        return `@${cState["display-name"]}, Please provide a channel name`
                    }
                    let channels = ChatBot.client.getChannels().map(val => {return val.replace("#","")})
                    if(!channels.includes(splitMsg[1].toLowerCase())) {
                        return `@${cState["display-name"]}, I'm not in there...`
                    }
                    channels.splice(channels.indexOf(splitMsg[1].toLowerCase()),1)
                    writeFileSync(join(__dirname, "../../client/channels.txt"), channels.join("\n"))
                    ChatBot.client.part(splitMsg[1].toLowerCase())
                    return `@${cState["display-name"]}, Left channel "${splitMsg[1]}"`
                }
                default:
                    break;
            }
            if (splitMsg[0] == "reload") {
                
            }
        }
        return `@${cState["display-name"]}, NOPERS`
    }
}