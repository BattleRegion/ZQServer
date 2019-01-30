const Base = require('./base');

class PlayerInfo extends  Base {

    constructor(env,handler){
        super(env);

        this.msgHandler = handler;
    }

    test(){
        this.send({
            handler:'player',
            event:'info',
            rawData:{
                token:this.userToken
            }
        });
        super.test();
    }
}

module.exports = PlayerInfo;