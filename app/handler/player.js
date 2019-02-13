const dataAccess = require('dataAccess');
const Command = dataAccess.command;
const Executor = dataAccess.executor;
const Player = require('../model/game/play/player');
module.exports = {

    info:(req_p, ws) =>{
        let uid = req_p.rawData.uid;
        Player.getPlayerInfo(uid, (e,r)=>{
            if(e){
                BaseHandler.commonResponse(req_p, {code:e.message},ws);
            }
            else{
                let rawData = Object.assign({code:GameCode.SUCCESS},{
                    uid:r.uid,
                    dungeon_level:r.dungeon_level
                });
                BaseHandler.commonResponse(req_p, rawData,ws);
            }
        })
    },

    //绑定用户
    bindPlayer:(req_p, ws) =>{
        let rawData = req_p.rawData;
        let uid = rawData['uid'].toString();
        ServerManager.bindUser(uid, ws);
        Log.info(`用户:${uid} 绑定成功`);
        BaseHandler.commonResponse(req_p, {
            code: GameCode.SUCCESS,
        },ws)
    }
};