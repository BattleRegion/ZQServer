const Base = require('./base');
class Player extends Base {

    constructor(env,handler){
        super(env, handler);
    }

    info(){
        this.send({
            handler:'player',
            event:'info',
            rawData:{
                token:this.userToken
            }
        });
    }
}

module.exports = Player;