const {writeFileSync} = require('fs');
const {readFile} = require('fs/promises');
const {join} = require('path');
const _ = require("lodash")
/**
 * @param {string} id 
 * @param {_.PropertyPath} propertyPath 
 * @param {*} value 
 */


async function setUserValue(id, propertyPath, value) {
    if (id == null) {return}
    let filepath = join(__dirname, `../../data/users/${id}.json`)
    return readFile(filepath, {encoding:"utf-8"}).then(data => {
        let u = JSON.parse(data)
        _.set(u,propertyPath, value)
        writeFileSync(filepath, JSON.stringify(u))
        return
    }).catch((_err) => {
        console.error("error: ",_err)
        let u = JSON.parse("{}")
        _.set(u, propertyPath, value)
        writeFileSync(filepath, JSON.stringify(u))
        return 
    })
}
/**
 * @param {string} id 
 * @param {_.PropertyPath} propertyPath 
 */
async function deleteUserValue(id, propertyPath) {
    return setUserValue(id,propertyPath,undefined)
}
/**
 * @param {string} id 
 * @param {_.PropertyPath} propertyPath 
 * @returns {Promise<any>}
 */
async function readUserValue(id, propertyPath) {
    let filepath = join(__dirname, `../../data/users/${id}.json`)
    let f;
    return readFile(filepath).then(data => {
        f = JSON.parse(data)
        return _.get(f, propertyPath)
    }).catch(err => {return null})
}

module.exports = {
    setUserValue, readUserValue, deleteUserValue
}