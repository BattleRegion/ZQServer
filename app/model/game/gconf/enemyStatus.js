const conf = require('../../../gameConf/files/enemy_status');

module.exports = {

    enemyStatus : conf,

    baseAttribute: function(kind){
        for(let i = 0;i< this.enemyStatus.length;i++){
            let es = this.enemyStatus[i];
            if(es['ENEMY_STATUS_KIND'] === kind){
                return es;
            }
        }
        return null;
    },
};