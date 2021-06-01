const { randomInt } = require("crypto")

module.exports = {
    aliases: ["ptwt"],
    name: "peepo",
    description: "generates a peepo twitter tweet",
    perms: 0, // 0 = anyone can use
    opts: {puncCount:8,puncFrequency:3,words:[
        "wow",
        "mizkif",
        "omg",
        "oh no",
        "but",
        "xqc",
        "rust",
        "$*mizkifL",
        "$*mizkifHug",
        "$*mizkifAww",
        "$*xqcL",
        "$*xqcNotL",
        "$*mizkifPls",
        "gta rp",
        "gamba",
        "forsen",
        "esfand",
        "simply",
        "simpmom",
        "poki",
        "hug",
        "@REALMizkif",
        "matthew",
        "good peepo",
        "maya",
        "trihard",
        "offline",
        "red fish",
        "smite night",
        "woweee",
        "clint",
        "OTK"
    ]},
    /**
     * @param {string} cChan
     * @param {import("tmi.js").ChatUserstate} cState
     * @param {string} cMsg
     */    
    async func(cChan, cState, cMsg) {
        i = 0
        let outMsg = []
        let firstWord = true
        while (i < randomInt(10)+9) {
            let thisWord = this.opts.words[randomInt(this.opts.words.length)]
            if (firstWord && thisWord.substr(0,2) != "$*") {
                outMsg.push(" "+thisWord.substring(0,1).toUpperCase() + thisWord.substring(1,thisWord.length))
                firstWord = false
            }
            else {
                thisWord = thisWord.replace("$*", "")
                firstWord = false
                if (thisWord.search(/[.!?]/) != -1) {
                    firstWord = true
                    outMsg.push(thisWord)
                }
                else if (randomInt(this.opts.puncFrequency) == 0) {
                    firstWord = true
                    outMsg.push(["!", "."][randomInt(2)].repeat(randomInt(this.opts.puncCount-1)+1))
                }
                else {
                    outMsg.push(" "+thisWord)
                }
            }
            i += 1
        }
        return outMsg.join("")
    }
}