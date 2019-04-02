const conf = require('../../../../gameConf/files/avatar_base');
const DataAccess = require('dataAccess');
const Executor = DataAccess.executor;
const Command = DataAccess.command;

const type = {
    1: 'weapon',
    2: 'deputy ',
    3: 'head',
    4: 'body'
}

module.exports = {

    Avatar: conf,

    getAvatar:function(avatarId){
        for(let i = 0;i< this.Avatar.Avatar.length;i++){
            let avatar = this.Avatar.Avatar[i];
            if(avatar['ID'] === avatarId){
                return avatar
            }
        }
    },

    getAvatarInfo: function(avatarId,cb){
        for(let i = 0;i< this.Avatar.Avatar.length;i++){
            let avatar = this.Avatar.Avatar[i];
            if(avatar['ID'] === avatarId){
                cb(null,avatar)
            }
        }
    },
    getAvatarList: function(cb){
        cb(null,this.Avatar.Avatar)
    },
    getPlayerAvatar:function(wxUid,cb){
        let sql = new Command('select * from player_avatar where wx_uid = ?', [wxUid]);
        Executor.query(DBEnv_ZQ, sql ,(e,r)=>{
            if(e){
                cb(new Error(e.message));
            }
            else{
                console.log(r)
                cb(null,r[0]);
            }
        })
    },

    // bind: function (wxUid,allAvatar,cb) {
    //     for (let i = 0; i < allAvatar.length; i++) {
    //         let avatar = allAvatar[i]
    //         let avatarId = avatar.avatarId
    //         let itemId = avatar.itemId
    //         let sql = new Command('insert into player_avatar(wx_uid,avatarId,itemId,createAt) values(?,?,?,?)', [wxUid, avatarId, itemId, ~~(new Date().getTime() / 1000)]);
    //         Executor.query(DBEnv_ZQ, sql, (e, r) => {
    //             if (e) {
    //                 Log.error(`insert into player_avatar db error ${e}`);
    //                 cb(new Error(GameCode.DB_ERROR), null);
    //             }
    //         })
    //     }
    // },

    equip:function (wxUid,avatarId,cb) {
        let avatar = this.getAvatar(avatarId)
        let part = type[avatar.EQUIP_REGION]

        let sql = new Command('update player_avatar set ' + part + ' = ? where wx_uid = ?', [avatarId, wxUid]);
        console.log(sql)
        Executor.query(DBEnv_ZQ, sql, (e, r) => {
            if (e) {
                Log.error(`update player_avatar db error ${e}`);
                cb(new Error(GameCode.DB_ERROR), null);
            }else{
                console.log(r)
                cb(null,true);
            }
        })
    }
};