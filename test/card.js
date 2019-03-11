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
    
    draw(){
        this.send({
            handler:'card',
            event:'draw',
            rawData:{
                token:this.userToken,
                discard:['200_001_10002']
            }
        });
    }

}

module.exports = Card;