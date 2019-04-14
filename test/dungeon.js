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
                dungeonId:6,
                result:1,
                levelDamage:9000,
                levelRounds:24
            }
        });
    }

    ranking(){
        this.send({
            handler:'dungeon',
            event:'ranking',
            rawData:{
                token:this.userToken
            }
        });
    }
}

module.exports = Dungeon;