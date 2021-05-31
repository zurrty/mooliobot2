/**
 * r
 * @param {String} id 
 * @returns {any}
 */
async function requireAsync(id) {
    return require(id)
}

function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}

module.exports = {
    requireAsync, requireUncached
}