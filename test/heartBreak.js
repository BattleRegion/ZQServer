const Base = require('./base');

class HeartBreak extends  Base {

    constructor(env,handler){
        super(env);

        this.msgHandler = handler;

    }

    test(){
        this.send({
            handler:'sys',
            event:'heartbreak',
            rawData:{}
        });
        super.test();
    }
}

module.exports = HeartBreak;