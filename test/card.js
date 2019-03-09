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

}

module.exports = Card;