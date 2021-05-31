const tmi = require("tmi.js");
const { requireUncached } = require("./helpers/utils");
const { UncachedModule } = require("./classes/uncached-file");
const { join } = require("path");
const { loadCommands } = require("./commands");
const { readFileSync, existsSync } = require("fs");
console.log(join(__dirname,"../client/options.json"))
const BOT_CONFIG = new UncachedModule(join(__dirname,"../client/options.json"))
let chat_bot = null 
function IsCommonBot(channel) {
    BOT_CONFIG.commonBots.forEach(b => {
        if ("#"+b == channel.toLowerCase()) {
            return true
        }
    });
}

class ChatBot {
    /**
     * @param {tmi.Options} opts Login information for the bot
     */
    constructor(opts) {
        this.username = opts.identity.username
        this.commands = new Map()
        this.reloadCommands()
        this.client = tmi.client(opts)
        this.client.connect()
        this.client.on("connected", () => console.log("connected"))
        this.client.on("message", this.OnMessage)
    }
    reloadCommands () {
        loadCommands().forEach((file) => {
            const cmd = require(`./commands/${file}`)
            this.commands.set(cmd.name, file)
            if (cmd.aliases != null) {
                cmd.aliases.forEach(alias => {
                    this.commands.set(alias, file)
                });
            }
        })
        console.log(this.commands)
    }
    SendMessage(channel,message) {
        if (channel != null && message != null) {
            this.client.say(channel,message)
        }
    }
    OnMessage = (chan, state, msg, self) => {
        //console.log(`${chan} | ${state["display-name"]}:${msg}`)
        if (self || (BOT_CONFIG.module.ignoreCommonBots && BOT_CONFIG.module.commonBots.includes(state["username"]))) {
            return
        }
        if (msg.startsWith(BOT_CONFIG.module.prefix)) {
            var splitMsg = msg.split(" ")
            const cmdName = this.commands.get(splitMsg[0].substring(1,splitMsg[0].length).toLowerCase())
            if (!cmdName) {
                return
            }
            const cmdPath = join(__dirname,`./commands/${cmdName}`)
            if (existsSync(cmdPath)) {
                const cmd = requireUncached(cmdPath)
                if(cmd != null && cmd.func != null) {
                    cmd.func(chan,state,msg.substring(splitMsg[0].length).trim()).then(res => {
                        this.SendMessage(chan, res)
                    }).catch(err => {
                        console.log(err)
                        this.SendMessage(chan, `@${state["display-name"]}, sorry i fucked up on that one. tell zurrty to fix his broke ass bot.`)
                    })
                }
            }
        }
    }
    
}

function Main() {
    let opts = require("../client/client-login.json")
    opts["channels"] = readFileSync(join(__dirname,"../client/channels.txt"),{encoding:"utf-8"}).split("\n").map((val) => {
        console.log(val)
        return val.replace("#","")
    })
    console.log(opts)
    chat_bot = new ChatBot(opts)
    module.exports.chat_bot = chat_bot
}
Main()