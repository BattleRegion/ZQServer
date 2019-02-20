const conf = require('../../../gameConf/files/global');
console.log(conf.Global[1]);
module.exports = {
    getGlobalConf: function(key){
        console.log(conf.Global[1]);
        return conf.Global[1][key];
    },
};