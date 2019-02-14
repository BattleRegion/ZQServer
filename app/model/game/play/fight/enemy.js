const Unit = require('./fightUnit');

class Enemy extends Unit {
    constructor(enemyConf, baseAttr, pos){

        super({
            name: enemyConf['NAME'],
            pos:pos,
        });

        let baseAttr_ratio = enemyConf['STATUS_RATIO'].split('\n');
        let curBaseAttr = Object.assign({},baseAttr);
        let realBaseRatio = {};
        for(let i = 0;i<baseAttr_ratio.length;i++){
            let attInfo = baseAttr_ratio[i].split('=');
            let att = attInfo[0];
            realBaseRatio[att] = attInfo[1] ? parseFloat(attInfo[1])/100:1;
        }
        Object.keys(curBaseAttr).forEach(key=>{
            if(realBaseRatio[key]){
                curBaseAttr[key] = curBaseAttr[key] * realBaseRatio[key];
            }
            if(key !== "ENEMY_STATUS_KIND"){
                this[key.toLowerCase()] = curBaseAttr[key];
            }
        });

        this.setCurHp(this.hp);
    }
}
module.exports = Enemy;