const Base = require('./base');
class Avatar extends Base {

    constructor(env,handler){
        super(env, handler);
    }
    //获取装备信息
    //{"handler":"avatar","event":"getAvatarInfo","rawData":{"code":200,"avatarInfo":{"ID":"1","SEQUENCE_ID":"1","TYPE":"1","SUB_TYPE":"1","BASIC_EXPLAIN":"x","DETAIL_EXPLAIN":"x","CATEGORY":"1","EQUIP_REGION":"1"}}}
    getAvatarInfo(){
        this.send({
            handler:'avatar',
            event:'getAvatarInfo',
            rawData:{
                token:this.userToken,
                avatarId:"700_001_10001"
            }
        });
    }

    getAvatarList(){
        this.send({
            handler:'avatar',
            event:'getAvatarList',
            rawData:{
                token:this.userToken,
            }
        });
    }

    //获取角色装备
    //{"handler":"avatar","event":"getPlayerAvatar","rawData":{"code":200,"playerAvatar":{"id":1,"wx_uid":"oQWQQ5SM04moIxt13PqmTqx0fN6Y","weapon":1,"deputy":1,"head":1,"body":1,"createAt":""}}}
    getPlayerAvatar(){
        this.send({
            handler:'avatar',
            event:'getPlayerAvatar',
            rawData:{
                token:this.userToken,
            }
        });
    }

    //穿衣
    //{"handler":"avatar","event":"equip","rawData":{"code":200,"success":true}}
    equip(){
        this.send({
            handler:'avatar',
            event:'equip',
            rawData:{
                token:this.userToken,
                avatarId:"700_001_10001"
            }
        });
    }
}

module.exports = Avatar;