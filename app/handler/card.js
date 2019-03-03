const dataAccess = require('dataAccess');
const Command = dataAccess.command;
const Executor = dataAccess.executor;
const Card = require('../model/game/play/card/card');
module.exports = {

    initCardStack:(req_p, ws) =>{
        let lid = req_p.rawData.levelId;
        Card.getCardGroup(lid, (e,r)=>{
            if(e){
                BaseHandler.commonResponse(req_p, {code:e.message},ws);
            }
            else{
                BaseHandler.commonResponse(req_p, 'success',ws);
            }
        })
    }
};