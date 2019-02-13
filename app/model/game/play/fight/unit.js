
class Unit {
    constructor(opt){
        this.name = opt.name;
        if(opt.pos){
            let pos = opt.pos.split(',');
            this.posX = ~~pos[0];
            this.posY = ~~pos[1];
        }
    }
}

module.exports = Unit;