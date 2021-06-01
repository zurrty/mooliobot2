const tmi = require("tmi.js");
const { requireUncached } = require("./helpers/utils");
const { UncachedModule } = require("./classes/uncached-file");
const { join } = require("path");
const { loadCommands } = require("./commands");
const { readFileSync, existsSync, writeFileSync } = require("fs");
const {showWarning} = require("../client/console-warnings");
const { readUserValue, setUserValue } = require("./UserManagement");
const {afkMessageBuilder} = require("./UserManagement/afk");
const { readFile } = require("fs/promises");
const { AdminEvent } = require("./events");
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
        AdminEvent.on("reloadCommands", ()=> this.reloadCommands())
        AdminEvent.on("joinChannel", (...args)=> this.client.join(args[0]))
        AdminEvent.on("partChannel", (...args)=> this.client.part(args[0]))
        this.client.connect().catch(err => {
            if (err.search(/Login authentication failed/) != -1) {
                showWarning("loginFailed")
            }
            process.exit(0)
        })
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
        readUserValue(state["user-id"], ["afk"]).then(afk => {
            if (null, undefined == afk) return
            afkMessageBuilder(afk, state).then((afkMsg) => {
                console.log(afkMsg)
                this.SendMessage(chan, afkMsg)
                setUserValue(state["user-id"], ["afk"], undefined)
            })
        })
        if (msg.startsWith(BOT_CONFIG.module.prefix)) {
            var splitMsg = msg.split(" ")
            const cmdTrigger = splitMsg[0].substring(1,splitMsg[0].length).toLowerCase()
            const cmdName = this.commands.get(cmdTrigger)
            if (!cmdName) {
                return
            }
            const cmdPath = join(__dirname,`./commands/${cmdName}`)
            if (existsSync(cmdPath)) {
                const cmd = requireUncached(cmdPath)
                if(cmd != null && cmd.func != null) {
                    cmd.func(chan,state,msg.substring(splitMsg[0].length).trim(),cmdTrigger).then(res => {
                        this.SendMessage(chan, res)
                    }).catch(err => {
                        console.error(err)
                        this.SendMessage(chan, `@${state["display-name"]}, sorry i fucked up on that one. tell zurrty to fix his broke ass bot.`)
                    })
                }
            }
        }
    }
}

function Main() {
    if (!existsSync(join(__dirname, "../client/client-login.json"))) {
        writeFileSync(join(__dirname, "../client/client-login.json"), 
`{
    "identity": {
        "username": "your_username",
        "password": "your_oauth_code"
    }
}`)
        console.error(`
Please open the newly generated file located at "../client/client-login.json" and input your bot login data
To get an oauth token, go to https://twitchapps.com/tmi/ and login with your bot account.
Copy and paste the entire code into the "password" section.
The file should now look something like this:
{
    "identity": {
        "username":"mooliobot",
        "password":"oauth:1234567890qwertyuiop"
    }
}
Note: NEVER publicly share your oauth password. The one above is (obviously) not a real oauth code.If your code somehow does get leaked, go to https://www.twitch.tv/settings/connections on your bot account, scroll down to Other Connections, and disconnect Twitch Chat OAuth Token Generator. After that, you can regenerate your OAuth token.`)
        process.exit(0)
    }
    let opts = require("../client/client-login.json")
    loadChannels().then(channels => {
        opts["channels"] = channels
        chat_bot = new ChatBot(opts)
    })
}
if (process.argv.includes("-commands")) {
    require("../scripts/generateCommands").generateCommands()
    process.exit(0)
}
else {
    Main()
}


async function loadChannels() {
    return readFile(join(__dirname,"../client/channels.txt"),{encoding:"utf-8"}).then(data => {
        return data.split("\n").map((val) => {
            console.log(val)
            return val.replace("#","")
        })
    })
}

module.exports = {
    loadChannels
}