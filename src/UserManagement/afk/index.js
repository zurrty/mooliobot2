const {createTimeObject} = require("../time")
const afkMessages = require("../../../locale/afk-messages.json")
const { randomInt, Cipher } = require("crypto")


function timeThing(timeObject) {
    outTime = ""
    if (timeObject.days > 0) {
        outTime += `${timeObject.days} days, `
    }
    if (timeObject.hours > 0) {
        outTime += `${timeObject.hours} hours, `
    }
    if (timeObject.minutes > 0) {
        outTime += `${timeObject.minutes} minutes, `
    }
    if (timeObject.seconds > 0) {
        outTime += `${timeObject.seconds} seconds, `
    }
    return outTime.trim().slice(0,-1)
}
/**
 * @param {import("tmi.js").ChatUserstate} state 
 */
async function afkMessageBuilder(afk, state) {
    console.log(afk)
    if (!afk) {
        return null
    }
    let difference = createTimeObject(Date.now() - afk.time)
    msgArray = afkMessages[afk["type"]]
    if (!msgArray) return null
    let outMsg = msgArray[randomInt(msgArray.length)].replace(/{user}/,`@${state["display-name"]}`)
    console.log("message: ",outMsg)
    if (afk["msg"] != "") {
        outMsg = outMsg.replace(/{msg}/, `| ${afk["msg"]} |`)
    }
    else {
        outMsg = outMsg.replace(/{msg}/, "|")
    }
    outMsg = outMsg.replace(/{time}/, timeThing(difference))
    return outMsg
}
module.exports = {
    afkMessageBuilder
}