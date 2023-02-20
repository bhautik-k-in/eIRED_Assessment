/**
 * @description Global response method
 * @author Bhautik Kevadiya
 * @param {*} status 
 * @param {*} message 
 * @param {*} response 
 * @param {*} page 
 * @param {*} total 
 * @returns Modified proper user readable message
 */
exports.sendJson = function sendJson (status = 200, message = null, response = null, page = null, total = null) {
    let res = {
        status        : status,
        statusState   : status === 200 ? 'success' : 'error',
        message       : message,
        data          : response instanceof Array ? response : response instanceof Object ? response : [],
        page          : page,
        total         : total
    }

    res = Object.entries(res).reduce((arr, [key, value]) => ( value ? ( arr[key] = value, arr) : arr), {});
    return this.status(200).send(res);
}