const DataAccess = require('dataAccess');
const Executor = DataAccess.executor;
const Command = DataAccess.command;
const conf = require('../../../gameConf/files/card_base');

module.exports = {

	Card = conf['Card'],

    getCardInfo: function(cardID){
        for(let i = 0;i< this.Card.length;i++){
            let card = this.Card[i];
            if(card['ID'] === cardID){
                return card;
            }
        }
        return null;
    }
};