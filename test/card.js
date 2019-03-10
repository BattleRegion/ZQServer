const Base = require('./base');
class Card extends Base {

    constructor(env,handler){
        super(env, handler);
    }

    initStack(){
        this.send({
            handler:'card',
            event:'initStack',
            rawData:{
                token:this.userToken
            }
        });
    }
    
    discard(){
        this.send({
            handler:'card',
            event:'discard',
            rawData:{
                token:this.userToken,
                cid:'200_001_10001'
            }
        });
    }

}

module.exports = Card;