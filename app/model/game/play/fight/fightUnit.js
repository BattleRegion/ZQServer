const Unit = require('./unit');
class FightUnit extends Unit{
    constructor(opt){
        super(opt);
        this.curHp = opt.curHp;
        this.hp = opt.hp;
    }
}

module.exports = FightUnit;