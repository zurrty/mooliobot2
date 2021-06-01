const {join} = require("path")
const {writeFileSync} = require("fs")
const botOptions = require("../../client/options.json")
const { AdminEvent } = require("../events")
const { loadChannels } = require("..")

module.exports = {
    perms: 0, // 0 = anyone can use
    aliases: ["mad","mod"],
    name: "admin",
    description: "commands for admins.",
    /**
     * @param {string} cChan
     * @param {import("tmi.js").ChatUserstate} cState
     * @param {string} cMsg
     */
    func: async (cChan, cState, cMsg) => {
        if (botOptions.admins.includes(cState["user-id"])) {
            const splitMsg = cMsg.split(" ")
            switch (splitMsg[0]) {
                case "reload": {
                        AdminEvent.emit("reloadCommands")
                        return `@${cState["display-name"]}, Reloaded commands`
                    }
                case "join": {
                        if (splitMsg[1] == undefined || splitMsg[1] == "") {
                            return `@${cState["display-name"]}, Please provide a channel name`
                        }
                        
                        let channels = await loadChannels()
                        channels = channels.map(val => {return val.replace("#","")})
                        if(channels.includes(splitMsg[1].toLowerCase())) {
                            return `@${cState["display-name"]}, I'm already there...`
                        }
                        channels.push(splitMsg[1].toLowerCase())
                        writeFileSync(join(__dirname, "../../client/channels.txt"), channels.join("\n"))
                        AdminEvent.emit("joinChannel", splitMsg[1].toLowerCase())
                        return `@${cState["display-name"]}, Joined channel "${splitMsg[1]}"`
                    }
                case "exit":
                case "part":
                case "leave": {
                    if (splitMsg[1] == undefined || splitMsg[1] == "") {
                        return `@${cState["display-name"]}, Please provide a channel name`
                    }
                    let channels = await loadChannels()
                        channels = channels.map(val => {return val.replace("#","")})
                        if(!channels.includes(splitMsg[1].toLowerCase())) {
                        return `@${cState["display-name"]}, I'm not in there...`
                    }
                    channels.splice(channels.indexOf(splitMsg[1].toLowerCase()),1)
                    writeFileSync(join(__dirname, "../../client/channels.txt"), channels.join("\n"))
                    AdminEvent.emit("partChannel", splitMsg[1].toLowerCase())
                    return `@${cState["display-name"]}, Left channel "${splitMsg[1]}"`
                }
                default:
                    return `@${cState["display-name"]}, Please enter a command`
            }
        }
        return `@${cState["display-name"]}, This command is restricted to registered bot admins only!`
    }
}