const os = require('os');

function getSys(key){
    if(typeof os[key] === 'function'){
        return os[key]()
    }
    return os[key];
}

module.exports = {
    getSys
}