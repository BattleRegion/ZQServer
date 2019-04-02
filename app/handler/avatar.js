const Player = require('../model/game/play/player');
const AvatarBase = require('../model/game/play/avatar/avatarBase');

module.exports = {
    //绑定装备到角色
    // bindAvatar:function(req_p, ws){
    //     let uid = req_p.rawData.uid;
    //     let allAvatar = req_p.rawData.allAvatar;
    //     Player.getPlayerInfo(uid, (e,playerInfo)=>{
    //         if(e){
    //             BaseHandler.commonResponse(req_p, {code:e.message},ws);
    //         }
    //         else{
    //             AvatarBase.bind(uid,allAvatar,(e, handInfo)=>{
    //                 if(e){
    //                     BaseHandler.commonResponse(req_p, {code:e.message},ws);
    //                 } else {
    //                     BaseHandler.commonResponse(req_p, {code:GameCode.SUCCESS, handInfo:handInfo},ws);
    //                 }
    //             })
    //         }
    //     })
    // },

    //获取装备信息
    getAvatarInfo:function(req_p, ws){
        let uid = req_p.rawData.uid;
        let avatarId = req_p.rawData.avatarId;
        Player.getPlayerInfo(uid, (e,playerInfo)=>{
            if(e){
                BaseHandler.commonResponse(req_p, {code:e.message},ws);
            }
            else{
                AvatarBase.getAvatarInfo(avatarId,(e,avatarInfo)=>{
                    if(e){
                        BaseHandler.commonResponse(req_p, {code:e.message},ws);
                    }
                    else{
                        BaseHandler.commonResponse(req_p, {code:GameCode.SUCCESS, avatarInfo:avatarInfo},ws);
                    }
                })
            }
        })
    },
    //获取角色装备
    getPlayerAvatar:function(req_p, ws){
        let uid = req_p.rawData.uid;
        Player.getPlayerInfo(uid, (e,playerInfo)=>{
            if(e){
                BaseHandler.commonResponse(req_p, {code:e.message},ws);
            }
            else{
                AvatarBase.getPlayerAvatar(uid,(e, playerAvatar)=>{
                    if(e){
                        BaseHandler.commonResponse(req_p, {code:e.message},ws);
                    } else {
                        BaseHandler.commonResponse(req_p, {code:GameCode.SUCCESS, playerAvatar:playerAvatar},ws);
                    }
                })
            }
        })
    },

    //穿衣
    equip:function (req_p, ws) {
        let uid = req_p.rawData.uid;
        let avatarId = req_p.rawData.avatarId;
        Player.getPlayerInfo(uid, (e,playerInfo)=>{
            if(e){
                BaseHandler.commonResponse(req_p, {code:e.message},ws);
            }
            else{
                AvatarBase.equip(uid,avatarId,(e, success)=>{
                    if(e){
                        BaseHandler.commonResponse(req_p, {code:e.message},ws);
                    } else {
                        BaseHandler.commonResponse(req_p, {code:GameCode.SUCCESS, success:success},ws);
                    }
                })
            }
        })
    }

};