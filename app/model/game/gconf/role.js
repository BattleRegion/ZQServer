const conf = require('../../../gameConf/files/role');

module.exports = {

    roleBasics : conf['Role_Basic'],

    roleConf: function(roleId){
        for(let i = 0;i< this.roleBasics.length;i++){
            let rb = this.roleBasics[i];
            if(rb['ROLE_ID'] === roleId){
                return rb;
            }
        }
        return null;
    },
};