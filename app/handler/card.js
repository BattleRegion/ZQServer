const dataAccess = require('dataAccess');
const Command = dataAccess.command;
const Executor = dataAccess.executor;
const CardBase = require('../model/game/play/card/cardBase');
const CardGacha = require('../model/game/play/card/cardGacha');
const LevelBasic = require('../model/game/gconf/levelBasic');
const Player = require('../model/game/play/player');

module.exports = {

    draw: function (req_p, ws) {
        let uid = req_p.rawData.uid;
        let discard = req_p.rawData.discard;
        Player.getPlayerInfo(uid, (e, playerInfo) => {
            if (e) {
                BaseHandler.commonResponse(req_p, {code: e.message}, ws);
            } else {
                let play_role = playerInfo['role'];
                let base_gacha = CardGacha.roleBaseGacha(play_role);
                if (!base_gacha) {
                    return BaseHandler.commonResponse(req_p, {code: `No base gacha found by role: ${play_role}`}, ws);
                }
                if (discard) {
                    CardGacha.drawPlayerCards(uid, discard, base_gacha['BASIC_CARDGROUPID'], base_gacha['BASIC_CARDNUM'], (e, handInfo) => {
                        if (e) {
                            BaseHandler.commonResponse(req_p, {code: e.message}, ws);
                        } else {
                            BaseHandler.commonResponse(req_p, {code: GameCode.SUCCESS, handInfo: handInfo}, ws);
                        }
                    })
                } else {
                    CardGacha.initPlayerCards(uid, base_gacha['BASIC_CARDGROUPID'], base_gacha['BASIC_CARDNUM'], (e, handInfo) => {
                        if (e) {
                            BaseHandler.commonResponse(req_p, {code: e.message}, ws);
                        } else {
                            BaseHandler.commonResponse(req_p, {code: GameCode.SUCCESS, handInfo: handInfo}, ws);
                        }
                    })
                }
            }
        })
    },

    current: function (req_p, ws) {
        let uid = req_p.rawData.uid;
        Player.getPlayerInfo(uid, (e, playerInfo) => {
            if (e) {
                BaseHandler.commonResponse(req_p, {code: e.message}, ws);
            } else {
                CardGacha.getCurrentCards(uid, (e, cardsInfo) => {
                    if (e) {
                        BaseHandler.commonResponse(req_p, {code: e.message}, ws);
                    } else {
                        BaseHandler.commonResponse(req_p, {code: GameCode.SUCCESS, cardsInfo: cardsInfo}, ws);
                    }
                })
            }
        })
    },

    getLoot: function (req_p, ws) {
        let uid = req_p.rawData.uid;
        Player.getPlayerInfo(uid, (e, playerInfo) => {
            if (e) {
                BaseHandler.commonResponse(req_p, {code: e.message}, ws);
            } else {
                let play_role = playerInfo['role'];
                let base_gacha = CardGacha.roleBaseGacha(play_role);
                if (!base_gacha) {
                    BaseHandler.commonResponse(req_p, {code: `No base gacha found by role: ${play_role}`}, ws);
                }
                CardGacha.getLootCards(uid, playerInfo['dungeon_level'], base_gacha['BASIC_CARDGROUPID'], (e, lootInfo) => {
                    if (e) {
                        BaseHandler.commonResponse(req_p, {code: e.message}, ws);
                    } else {
                        BaseHandler.commonResponse(req_p, {code: GameCode.SUCCESS, lootInfo: lootInfo}, ws);
                    }
                })
            }
        })
    },

    setLoot: function (req_p, ws) {
        let uid = req_p.rawData.uid;
        let lootId = req_p.rawData.lootId;
        Player.getPlayerInfo(uid, (e, playerInfo) => {
            if (e) {
                BaseHandler.commonResponse(req_p, {code: e.message}, ws);
            } else {
                let play_role = playerInfo['role'];
                let base_gacha = CardGacha.roleBaseGacha(play_role);
                if (!base_gacha) {
                    BaseHandler.commonResponse(req_p, {code: `No base gacha found by role: ${play_role}`}, ws);
                }
                else {
                    //, playerInfo['dungeon_level']
                    CardGacha.setLootCards(uid, lootId, base_gacha['BASIC_CARDGROUPID'], (e, success) => {
                        if (e) {
                            BaseHandler.commonResponse(req_p, {code: e.message}, ws);
                        } else {
                            BaseHandler.commonResponse(req_p, {code: GameCode.SUCCESS, success: success}, ws);
                        }
                    })
                }
            }
        })
    }
};