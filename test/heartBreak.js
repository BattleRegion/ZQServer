const Base = require('./base');

class HeartBreak extends  Base {

    constructor(handler){
        super();

        this.msgHandler = handler;
    }

    test(){
        this.send({
            handler:'sys',
            event:'heartbreak',
            rawData:{}
        })
    }
}

module.exports = HeartBreak;