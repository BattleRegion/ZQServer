const Unit = require('./unit');
class FightUnit extends Unit{
    constructor(opt){
        super(opt);
        this.hp = opt.hp;
        this.curHp = this.hp;
    }
}

module.exports = FightUnit;