const { join } = require("path")
const {loadCommands} = require("../src/commands")
const {writeFileSync} = require("fs")
module.exports = {
    generateCommands() {
        let outArray = []

        loadCommands().forEach(cmdName => {
            const cmd = require(join(__dirname, "../src/commands/"+cmdName))
            outArray.push(`${cmd.name}|${cmd.aliases != null ? cmd.aliases.join(",") : "none"}|${cmd.description ? cmd.description : "No description yet"}|${cmd.perms != null ? cmd.perms : 0}`)
        })
        
        writeFileSync(join(__dirname, "../commands.md"), 
`# Commands
_The prefix for all mooliobot commands is \`-\`_
#### -Mahatma Gandhi (236 B.C)

## Bot commands
Command title | Aliases | Description | Permissions
--------------|---------|-------------|------------
${outArray.join("\n")}

## Permissions

Permission levels|Corresponding chat role
-----------------|-----------------------
0|Pleb
1|Follower
2|Subscriber
3|VIP
4|Mod
5|Editor
6|Mooliobot admin`
)
    }
}
