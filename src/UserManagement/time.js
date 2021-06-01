function createTimeObject(time) {
    let diff = time / 1000;
    let obj = { days: NaN, hours: NaN, minutes: NaN, seconds: NaN, total: NaN }
    obj.total = diff;
    obj.days = Math.floor(diff / 86400);
    diff -= obj.days * 86400;
    obj.hours = Math.floor(diff / 3600) % 24;
    diff -= obj.hours * 3600;
    obj.minutes = Math.floor(diff / 60) % 60;
    diff -= obj.minutes * 60;
    obj.seconds = Math.floor(diff);
    return obj;
}

module.exports = {
    createTimeObject
}