const dataAccess = require('dataAccess');
const Command = dataAccess.command;
const Executor = dataAccess.executor;
const CardBase = require('../model/game/play/card/cardBase');
const LevelBasic = require('../model/game/gconf/levelBasic');
const Player = require('../model/game/play/player');

module.exports = {

    initStack:function(req_p, ws) =>{
        let uid = req_p.rawData.uid;
        Player.getPlayerInfo(uid, (e,playerInfo)=>{
            if(e){
                BaseHandler.commonResponse(req_p, {code:e.message},ws);
            }
            else{
                BaseHandler.commonResponse(req_p, 'success',ws);
            }
        })
    },
    
    draw:function(req_p, ws) =>{
    		let uid = req_p.rawData.uid;
    		//TODO
    },
    
    discard:function(req_p, ws) =>{
    		let uid = req_p.rawData.uid;
    		//TODO
    },
    
    loot:function(req_p, ws) =>{
    		let uid = req_p.rawData.uid;
    		//TODO
    }
};