const Base = require('./base');
class Card extends Base {

    constructor(env,handler){
        super(env, handler);
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
    
    current(){
        this.send({
            handler:'card',
            event:'current',
            rawData:{
                token:this.userToken
            }
        });
    }

}

module.exports = Card;