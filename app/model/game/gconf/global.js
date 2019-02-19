const conf = require('../../../gameConf/files/global');

module.exports = {

    globalConf : conf.Global[1],

    getGlobalConf: function(key){
        return globalConf[key];
    },
};