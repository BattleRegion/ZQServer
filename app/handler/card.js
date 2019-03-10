const dataAccess = require('dataAccess');
const Command = dataAccess.command;
const Executor = dataAccess.executor;
const CardBase = require('../model/game/play/card/cardBase');
const CardGacha = require('../model/game/play/card/cardGacha');
const LevelBasic = require('../model/game/gconf/levelBasic');
const Player = require('../model/game/play/player');

module.exports = {

    initStack:function(req_p, ws) {
        let uid = req_p.rawData.uid;
        Player.getPlayerInfo(uid, (e,playerInfo)=>{
            if(e){
                BaseHandler.commonResponse(req_p, {code:e.message},ws);
            }
            else{
                let play_role = playerInfo['role'];
                let base_gacha = CardGacha.roleBaseGacha(play_role);
                if (!base_gacha) {
                		BaseHandler.commonResponse(req_p, {code:`No base gacha found by role: ${play_role}`},ws);
                }
                CardGacha.getPlayerCards(uid, base_gacha['BASIC_CARDGROUPID'], base_gacha['BASIC_CARDNUM'], (e, handInfo)=>{
                		if(e){
		                BaseHandler.commonResponse(req_p, {code:e.message},ws);
		            } else {
		            		BaseHandler.commonResponse(req_p, {code:GameCode.SUCCESS, handInfo:handInfo},ws);
		            }
                })
            }
        })
    },
    
    draw:function(req_p, ws) {
    		let uid = req_p.rawData.uid;
    		//TODO
    },
    
    discard:function(req_p, ws) {
    		let uid = req_p.rawData.uid;
    		let cid = req_p.rawData.cid;
    		//TODO
    },
    
    loot:function(req_p, ws) {
    		let uid = req_p.rawData.uid;
    		//TODO
    }
};