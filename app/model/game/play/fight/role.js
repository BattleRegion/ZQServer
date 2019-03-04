const FightUnit = require('./fightUnit');

class Role extends FightUnit {
    constructor(roleConf, pos){
        super({
            name : roleConf['NAME'],
            pos: pos,
        });

        Object.keys(roleConf).forEach(key=>{
            if(key !== "ROLE_CARDGROUPID" && key !== "EQUIPABLE_CATEGORY"
                && key !== "MAX_HP" && key!== "MAX_EP"){
                this[key.toLowerCase()] = roleConf[key];
            }
            if(key === "MAX_HP"){
                this.hp = roleConf["MAX_HP"];
            }

            if(key === "MAX_EP"){
                this.ep = roleConf["MAX_EP"];
            }
        });

        this.setCurHp(this.hp);
        this.setEp(this.ep);
    }

    setEp(ep){
        this.curEp = ep;
    }
}
module.exports = Role;