const { watchFile } = require("fs");

class UncachedModule {
    constructor(id) {
        this.moduleId = id
        this.module = require(this.moduleId)
        watchFile(this.moduleId, {persistent:true}, this.OnFileUpdate)
    }
    OnFileUpdate = (cur,prv) => {
        delete require.cache[require.resolve(this.moduleId)];
        this.module = require(this.moduleId)
    }
}

module.exports = {
    UncachedModule
}