const DataAccess = require('dataAccess');
const Executor = DataAccess.executor;
const Command = DataAccess.command;
const roleConf = require('../../../../gameConf/files/role');
const levelConf = require('../../../../gameConf/files/level_basic');
const cardGachaConf = require('../../../../gameConf/files/card_gacha');
const cardConf = require('../../../../gameConf/files/card_basic');
const REDIS_CARDS_KEY = 'ZQ_CARDS_KEY';

module.exports = {

	CardGacha: cardGachaConf,
	
	Card: cardConf,
	
	CardDict: function() {
		let dict = {};
		for (let i = 0; i < this.Card.length; i++) {
			dict[this.Card[i]['ID']] = this.Card[i];
		}
		Log.info(`make CardDict ${JSON.stringify(dict)}`);
		return dict;
	},
	
	Role: roleConf,
	
	levelBasic: levelConf,
	
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
    		let cards_key = `${REDIS_CARDS_KEY}:${wxUid}`;
    		Log.info(`Try to get player initial cards from key ${cards_key}`);
    		
    		Executor.redisGet(DBEnv_ZQ, cards_key, (e,r)=>{
    			if(e){
                Log.error(`initPlayerCards redis error ${e}`);
                cb(new Error(GameCode.REDIS_ERROR), null);
            }
            else{
            		let cards = {};
                	let cardIdList = [];

                if(r){
                    let cardsAll = JSON.parse(r);
                    if (cardsAll['handList']) {
                    		Log.info(`getInitPlayerCards from redis ${r}`);
                    		cb(null, cardsAll['handList']);
                    }
                    // if has loot cards
                    if (cardsAll['lootCard']) {
                    		cardIdList.push(cardsAll['lootCards']);
                    }
                }
                	//Get all cards' id in the gacha by gacha id
                	for(let i = 0; i < this.CardGacha.length; i++) {
                		let gacha = this.CardGacha[i];
                		if(gacha['CARD_GACHA_ID'] === gachaId) {
                			cardIdList.push(gacha['CARD_ID']);
                		}
                	}

                	if(cardIdList.length > 0) {
                		//Randomly get $cardNum cards from card group
                		let shuffledList = cardIdList.sort(() => 0.5 - Math.random());
                		let handList = shuffledList.slice(0, cardNum);
                		//Take those $cardNum cards out of card group
                		for(let i = 0; i < handList.length; i++) {
                			let hand = handList[i];
                			let index = cardIdList.indexOf(hand);
                			if(index > -1) {
                				cardIdList.splice(index, 1);
                			}
                		}
                		// prepare to store redis
                		cards['cardIdList'] = cardIdList;
                		cards['handList'] = handList;
                		cards['discardList'] = [];
                		//Store $cardNum cards as init hand
                		Executor.redisSet(DBEnv_ZQ, cards_key, JSON.stringify(cards), (e) => {
                			if(e) {
                				Log.error(`setInitPlayerCards redis error ${e}`);
                				cb(new Error(GameCode.REDIS_ERROR), null);
                			} else {
                				Log.info('initPlayerCards and insert into redis ...');
                				cb(null, handList);
                			}
                		})
                	} else {
                		Log.error(`No cards found from ${JSON.stringify(cardIdList)}, set redis error`);
                		cb(new Error(GameCode.REDIS_ERROR), null);
                	}
    			}
		})
	},

	drawPlayerCards: function(wxUid, discard, gachaId, cardNum, cb) {
		let cards_key = `${REDIS_CARDS_KEY}:${wxUid}`;
		Log.info(`Try to get player cards from key ${cards_key}`);

        Executor.redisGet(DBEnv_ZQ, cards_key, (e, r) => {
	        	if(e) {
	        		Log.error(`drawPlayerCards redis error ${e}`);
	        		cb(new Error(GameCode.REDIS_ERROR), null);
	        	} else {
	        		let discardList = [];
	        		let cardsAll = JSON.parse(r);
	        		if(cardsAll) {
	        			discardList = cardsAll['discardList'];
	        		}
	        		for(let i = 0; i < discard.length; i++) {
	        			discardList.push(discard[i]);
	        		}

	        		let cardIdList = cardsAll['cardIdList'];
	        		Log.info(`getDrawPlayerCards from redis ${JSON.stringify(cardIdList)}`);
	        		if(cardIdList.length < cardNum) {
	        			for(let i = 0; i < discardList.length; i++) {
	        				cardIdList.push(discardList[i]);
	        			}
	        			discardList = [];
	        		}
	        		
	        		let cards = {};
	        		if(cardIdList.length > 0) {
	        			//Randomly get $cardNum cards from card group
	        			let shuffledList = cardIdList.sort(() => 0.5 - Math.random());
	        			let handList = shuffledList.slice(0, cardNum);
	        			//Take those $cardNum cards out of card group
	        			for(let i = 0; i < handList.length; i++) {
	        				let hand = handList[i];
	        				let index = cardIdList.indexOf(hand);
	        				if(index > -1) {
	        					cardIdList.splice(index, 1);
	        				}
	        			}
					
					// prepare to store redis
                		cards['cardIdList'] = cardIdList;
                		cards['handList'] = handList;
                		cards['discardList'] = discardList;
	        			Executor.redisSet(DBEnv_ZQ, cards_key, JSON.stringify(cards), (e) => {
	        				if(e) {
	        					Log.error(`setDrawPlayerCards redis error ${e}`);
	        					cb(new Error(GameCode.REDIS_ERROR), null);
	        				} else {
	        					Log.info('drawPlayerCards and insert into redis ...');
	        					cb(null, handList);
	        				}
	        			})
	        		} else {
	        			Log.error(`No cards found from ${JSON.stringify(cardIdList)}, set redis error`);
	        			cb(new Error(GameCode.REDIS_ERROR), null);
	        		}
	        	}
        })
	},
	
	getCurrentCards: function(wxUid, cb) {
		let cards_key = `${REDIS_CARDS_KEY}:${wxUid}`;
		Log.info(`Try to get player current cards from key ${cards_key}`);
		
		Executor.redisGet(DBEnv_ZQ, cards_key, (e,r)=>{
    			if(e){
                Log.error(`getCurrentCards redis error ${e}`);
                cb(new Error(GameCode.REDIS_ERROR), null);
           	} else {
            		if(r){
                    let cardsAll = JSON.parse(r);
                    let cardsPool = {};
                    if (cardsAll['cardIdList'] && cardsAll['discardList']) {
                    		Log.info(`getCurrentCards from redis ${r}`);
                    		cardsPool['pool'] = cardsAll['cardIdList'];
                    		cardsPool['discard'] = cardsAll['discardList'];
                    }
                    cb(null, cardsPool);
               } else {
               		Log.error(`No current cards found, set redis error`);
	        			cb(new Error(GameCode.REDIS_ERROR), null);
               }
            }
       	})
	},
	
	getLootCards: function(wxUid, level, gachaId, cb) {
		let cards = {};
		let cardIdList = [];
		let lootGacha = null;
		let levelInfo = level.split('_');
		
		for (let i = 0; i < this.levelBasic.length; i++) {
			let level = this.levelBasic[i];
			if (level['ID'] === levelInfo[0] && level['STAGE'] === levelInfo[1] && level['STAGE_NUM'] === levelInfo[2]) {
				lootGacha = level['LOOT_LOTTERY'];
				break;
			}
		}
		//Get all cards' id in the gacha by gacha id
		for (let i = 0; i < this.CardGacha.length; i++) {
			let gacha = this.CardGacha[i];
			if (gacha['CARD_GACHA_ID'] === gachaId) {
				cardIdList.push(gacha['CARD_ID']);
			}
			if (lootGacha && gacha['CARD_GACHA_ID'] === lootGacha) {
				cardIdList.push(gacha['CARD_ID']);
			}
		}
		
		//Randomly get 3 loot cards from card group
	    	let shuffledList = cardIdList.sort(() => 0.5 - Math.random());
	    let lootList = shuffledList.slice(0, 3);
		cb(null, lootList);
	},
	
	setLootCards: function(wxUid, lootId, gachaId, cb) {
		let cards_key = `${REDIS_CARDS_KEY}:${wxUid}`;
		Log.info(`setLootCards: Try to get player cards from key ${cards_key}`);
			
		Executor.redisGet(DBEnv_ZQ, cards_key, (e, r) => {
			if(e) {
				Log.error(`setLootCards: get player cards redis error ${e}`);
				cb(new Error(GameCode.REDIS_ERROR), null);
			} else {
				if(r) {
					let cardsAll = JSON.parse(r);
					cardsAll['lootCard'] = lootId;
					Executor.redisSet(DBEnv_ZQ, cards_key, JSON.stringify(cardsAll), (e) => {
						if(e) {
							Log.error(`set lootCard into redis error ${e}`);
							cb(new Error(GameCode.REDIS_ERROR), null);
						} else {
							Log.info(`make lootCard and insert into redis ${JSON.stringify(cardsAll)} ...`);
							cb(null, true);
						}
					})
				} else {
					Log.error(`No player cards found from key ${cards_key} in redis`);
					cb(new Error(GameCode.REDIS_ERROR), null);
				}
			}
		})
	}
}