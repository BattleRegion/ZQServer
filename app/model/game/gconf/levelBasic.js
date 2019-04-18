const conf = require('../../../gameConf/files/level_basic');

module.exports = {

    levelBasics : conf,

    confByDungeonLevel: function(dId, levelM, level){
        for(let i = 0;i< this.levelBasics.length;i++){
            let lb = this.levelBasics[i];
            if(lb.ID === dId && lb.STAGE === levelM && lb.STAGE_NUM === level){
                return lb;
            }
        }
        return null;
    },

    dungeonTotalLevels: function(dId){
        let count = 0;
        for(let i = 0;i< this.levelBasics.length;i++){
            let lb = this.levelBasics[i];
            if(lb.ID === dId ){
                count ++;
            }
        }
        return count;
    }
};