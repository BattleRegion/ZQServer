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

    finishLevel(){
        this.send({
            handler:'dungeon',
            event:'finishLevel',
            rawData:{
                token:this.userToken,
                dungeonId:1
            }
        });
    }
}

module.exports = Dungeon;