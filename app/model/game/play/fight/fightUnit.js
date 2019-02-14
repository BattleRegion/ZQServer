const Unit = require('./unit');
class FightUnit extends Unit{
    constructor(opt){
        super(opt);
        this.hp = opt.hp;
        this.curHp = 0;
    }

    setCurHp(hp){
        this.curHp = hp;
    }
}

module.exports = FightUnit;