const conf = require('../../../gameConf/files/global');

module.exports = {
    getGlobalConf: function(key){
        return conf.Global[1][key];
    },
};