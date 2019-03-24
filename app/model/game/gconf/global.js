const conf = require('../../../gameConf/files/global');

module.exports = {
    getGlobalConf: function(key){
        return conf[0][key];
    },
};