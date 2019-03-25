const conf = require('../../../gameConf/files/enemy_base');

module.exports = {

    enemyBases : conf,

    enemy: function(enemyId){
        for(let i = 0;i< this.enemyBases.length;i++){
            let enemy = this.enemyBases[i];
            if(enemy.ID === enemyId){
                return enemy;
            }
        }
        return null;
    },
};