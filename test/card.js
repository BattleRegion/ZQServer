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
                discard:null
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
    
	getLoot(){
        this.send({
            handler:'card',
            event:'getLoot',
            rawData:{
                token:this.userToken
            }
        });
    }    

    setLoot(){
        this.send({
            handler:'card',
            event:'setLoot',
            rawData:{
                token:this.userToken,
                lootId: "200_001_10001"
            }
        });
    }

}

module.exports = Card;