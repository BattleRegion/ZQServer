const DataAccess = require('dataAccess');
const Executor = DataAccess.executor;
const Command = DataAccess.command;
const roleConf = require('../../../../gameConf/files/role');
const cardGachaConf = require('../../../../gameConf/files/card_gacha');
const cardConf = require('../../../../gameConf/files/card_basic');
const REDIS_PLAYER_CARDS_KEY = 'ZQ_PLAYER_CARDS_KEY';
const REDIS_PLAYER_HAND_KEY = 'ZQ_PLAYER_HAND_KEY';
const REDIS_PLAYER_DISCARD_KEY = 'ZQ_PLAYER_DISCARD_KEY';

module.exports = {

	CardGacha: cardGachaConf['Card_Gacha'],
	
	Card: cardConf['Card'],
	
	Role: roleConf['Role_Basic'],
	
	roleBaseGacha: function(roleId) {
		for (let i = 0; i < this.Role.length; i++) {
			let role = this.Role[i];
			if (role['ROLE_ID'] == roleId) {
				return {'BASIC_CARDGROUPID': role['BASIC_CARDGROUPID'], 'BASIC_CARDNUM': role['BASIC_CARDNUM']};
			}
		}
		return null;
	},

    initPlayerCards: function(wxUid, gachaId, cardNum, cb) {
    		let cards_key = `${REDIS_PLAYER_CARDS_KEY}:${wxUid}`;
    		let hand_key = `${REDIS_PLAYER_HAND_KEY}:${wxUid}`;
    		Log.info(`Try to get player hand key ${hand_key}`);
    		
    		Executor.redisGet(DBEnv_ZQ, hand_key, (e,r)=>{
    			if(e){
                Log.error(`getPlayerHand redis error ${e}`);
                cb(new Error(GameCode.REDIS_ERROR), null);
            }
            else{
                if(r){
                    Log.info(`getPlayerHand from redis ${r}`);
                    cb(null, JSON.parse(r));
                }
                else{
                		let cardIdList = [];
                		//Get all cards' id in the gacha by gacha id
			        for (let i = 0; i < this.CardGacha.length; i++) {
			            let gacha = this.CardGacha[i];
			            if (gacha['CARD_GACHA_ID'] === gachaId) {
			                cardIdList.push(gacha['CARD_ID']);
			            }
			        }
			
			        if (cardIdList.length > 0) {
			        		let CardList = [];

			        		//TODO make CardBase a dict?
			        		//Get cards' details by cards id and prepare a card group to make hand
			        		for (let i = 0; i< cardIdList.length; i++) {
			        			for (let j = 0; j < this.Card.length; j++) {
			        				let card = this.Card[j];
			        				if (card['ID'] == cardIdList[i]) {
			        					CardList.push(card);
			        				}
			        			}
			        		}
			        		if (CardList.length > 0) {
			        			//Randomly get $cardNum cards from card group
			        			let shuffledList = CardList.sort(() => 0.5 - Math.random());
							let handList = shuffledList.slice(0, cardNum);
							//Take those $cardNum cards out of card group
							for (let i = 0; i< handList.length; i++) {
								let hand = handList[i];
								let index = cardIdList.indexOf(hand['ID']);
								if (index > -1) {
									cardIdList.splice(index, 1);
								}
							}
							//Store player's remained cards' id into card group
							Executor.redisSet(DBEnv_ZQ, cards_key, JSON.stringify(cardIdList), (e)=>{
				        			if(e){
		                        		Log.error(`setPlayerCards redis error ${e}`);
		                            	cb(new Error(GameCode.REDIS_ERROR), null);
		                        } else {
		                            	Log.info('setPlayerCards into redis ${JSON.stringify(cardIdList)}');
		                        }
				        		})
							//Store $cardNum cards as init hand
							Executor.redisSet(DBEnv_ZQ, hand_key, JSON.stringify(handList), (e)=>{
	                            	if(e){
	                            		Log.error(`setPlayerHand redis error ${e}`);
	                            		cb(new Error(GameCode.REDIS_ERROR), null);
	                            } else {
	                            		Log.info('getPlayerHand and insert into redis ...');
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
	},

	discardPlayerCards: function(wxUid, cardId, cb) {
		let key = `${REDIS_PLAYER_DISCARD_KEY}:${wxUid}`;
		cb(null, 'todo');
	}
}