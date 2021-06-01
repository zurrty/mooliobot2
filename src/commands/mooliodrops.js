module.exports = {
    perms: 0, // 0 = anyone can use
    aliases: ["moolio"],
    name: "mooliodrops",
    description: "moolio. cars go vroom vroom bang bang.",
    /**
     * @param {string} cChan
     * @param {import("tmi.js").ChatUserstate} cState
     * @param {string} cMsg
     */
    func: async (cChan, cState, cMsg) => {
        return "moolio. cars go vroom vroom bang bang."
    }
}