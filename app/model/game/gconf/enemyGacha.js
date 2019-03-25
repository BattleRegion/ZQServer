const conf = require('../../../gameConf/files/enemy_gacha');

module.exports = {

    enemyGachas : conf,

    enemyLotteryPool: function(lotteryId){
        let pools = [];
        for(let i = 0;i< this.enemyGachas.length;i++){
            let eg = this.enemyGachas[i];
            if(eg['ENEMY_GACHA_ID'] === lotteryId){
                pools.push(eg);
            }
        }
        return pools;
    },
};