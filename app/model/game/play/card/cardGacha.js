const DataAccess = require('dataAccess');
const Executor = DataAccess.executor;
const Command = DataAccess.command;
const roleConf = require('../../../../gameConf/files/role');
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
    		let cards_key = `${REDIS_CARDS_KEY}:${wxUid}`;
    		Log.info(`Try to get player cards key ${cards_key}`);
    		
    		Executor.redisGet(DBEnv_ZQ, cards_key, (e,r)=>{
    			if(e){
                Log.error(`getPlayerHand redis error ${e}`);
                cb(new Error(GameCode.REDIS_ERROR), null);
            }
            else{
                if(r){
                    let cardsAll = JSON.parse(r);
                    if (cardsAll['handList']) {
                    		Log.info(`getPlayerHand from redis ${r}`);
                    		cb(null, cardsAll['handList']);
                    }
                }
                	let cards = {};
                	let cardIdList = [];
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
    			}
		})
	},

	drawPlayerCards: function(wxUid, discard, gachaId, cardNum, cb) {
		let cards_key = `${REDIS_CARDS_KEY}:${wxUid}`;
		Log.info(`Try to get player cards key ${cards_key}`);

        Executor.redisGet(DBEnv_ZQ, cards_key, (e, r) => {
	        	if(e) {
	        		Log.error(`getPlayerDiscard redis error ${e}`);
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
	        		Log.info(`getPlayerCards into redis ${JSON.stringify(cardIdList)}`);
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
	        	}
        })
	}
}