const Base = require('./base');
class Dungeon extends Base {

    constructor(env,handler){
        super(env, handler);
    }

    nextLevel(){
        this.send({
            handler:'dungeon',
            event:'nextLevel',
            rawData:{
                token:this.userToken
            }
        });
    }
}

module.exports = Dungeon;