const DataAccess = require('dataAccess');
const Executor = DataAccess.executor;
const Command = DataAccess.command;
const roleConf = require('../../../gameConf/files/role');
const cardGachaConf = require('../../../gameConf/files/card_gacha');
const cardConf = require('../../../gameConf/files/card_base');
const REDIS_PLAYER_CARDS_KEY = 'ZQ_PLAYER_CARDS_KEY';

module.exports = {

	CardGacha = cardGachaConf['Card_Gacha'],
	
	Card = cardConf['Card'],
	
	Role = roleConf['Role_Basic'],
	
	roleBaseGacha: function(roleId) {
		for (let i = 0; i < this.Role.length; i++) {
			let role = this.Role[i];
			if (role['ROLE_ID'] == roleId) {
				return {'BASIC_CARDGROUPID': role['BASIC_CARDGROUPID'], 'BASIC_CARDNUM': role['BASIC_CARDNUM']};
			}
		}
		return null;
	},

    getPlayerCards: function(wxUid, gachaId, cardNum, cb) {
    		let key = `${REDIS_PLAYER_CARDS_KEY}:${wxUid}`;
    		Log.info(`Try to get player card gacha key ${key}`);
    		
    		Executor.redisGet(DBEnv_ZQ, key, (e,r)=>{
    			if(e){
                Log.error(`getPlayerCards redis error ${e}`);
                cb(new Error(GameCode.REDIS_ERROR), null);
            }
            else{
                if(r){
                    Log.info(`getPlayerCards from redis ${r}`);
                    cb(null, JSON.parse(r));
                }
                else{
                		let cardIdList = [];
			        for (let i = 0; i < this.CardGacha.length; i++) {
			            let gacha = this.CardGacha[i];
			            if (gacha['CARD_GACHA_ID'] === gachaId) {
			                cardIdList.push(gacha['CARD_ID']);
			            }
			        }
			
			        if (cardIdList.length > 0) {
			        		let CardList = [];
			        		//TODO make CardBase a dict?
			        		for (let i = 0; i< this.cardIdList.length; i++) {
			        			for (let j = 0; j < this.Card.length; j++) {
			        				let card = this.Card[i];
			        				if (card['ID'] == cardIdList[i]) {
			        					CardList.push(card);
			        				}
			        			}
			        		}
			        		if (CardList.length > 0) {
			        			let shuffledList = CardList.sort(() => 0.5 - Math.random());
							let handList = shuffledList.slice(0, cardNum);
							
							Executor.redisSet(DBEnv_ZQ, key, JSON.stringify(handList), (e)=>{
	                            	if(e){
	                            		Log.error(`setPlayerCards redis error ${e}`);
	                            		cb(new Error(GameCode.REDIS_ERROR), null);
	                            } else {
	                            		Log.info('getPlayerCards and insert into redis ...');
	                            		cb(null, handList);
	                            }
                            	})
			        		} else {
			        			Log.error(`No cards found from ${JSON.stringify(cardIdList)}, set redis error`);
	                        cb(new Error(GameCode.REDIS_ERROR), null);
			        		}
			        } else {
			        		Log.error(`No cards found by gacha id ${gachaId}, set redis error`);
	                    cb(new Error(GameCode.REDIS_ERROR), null);
			        }
                }
    			}
		})
	}
}