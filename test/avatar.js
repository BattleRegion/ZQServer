const Base = require('./base');
class Avatar extends Base {

    constructor(env,handler){
        super(env, handler);
    }

    getAvatarInfo(){
        this.send({
            handler:'avatar',
            event:'getAvatarInfo',
            rawData:{
                token:this.userToken,
                avatarId:"1"
            }
        });
    }

    getPlayerAvatar(){
        this.send({
            handler:'avatar',
            event:'getPlayerAvatar',
            rawData:{
                token:this.userToken,
            }
        });
    }

    equip(){
        this.send({
            handler:'avatar',
            event:'equip',
            rawData:{
                token:this.userToken,
                avatarId:"1"
            }
        });
    }
}

module.exports = Avatar;