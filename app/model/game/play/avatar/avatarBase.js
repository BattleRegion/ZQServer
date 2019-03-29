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

    getAvatarInfo: function(avatarId){
        for(let i = 0;i< this.Avatar.length;i++){
            let avatar = this.Avatar[i];
            if(avatar['ID'] === avatarId){
                return avatar;
            }
        }
        return null;
    },
    getPlayerAvatar:function(wxUid,cb){
        let sql = new Command('select * from player_avatar where wxUid = ?', [wxUid]);
        Executor.query(DBEnv_ZQ, sql ,(e,r)=>{
            if(e){
                cb(new Error(GameCode.REDIS_ERROR), null);
            }
            else{
                cb(r[0]);
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
        let avatar = this.getAvatarInfo(avatarId)
        let part = type[avatar.EQUIP_REGION]

        let sql = new Command('update player_avatar set ' + part + ' = ? where wxUid = ?', [avatarId, wxUid]);
        Executor.query(DBEnv_ZQ, sql, (e, r) => {
            if (e) {
                Log.error(`update player_avatar db error ${e}`);
                cb(new Error(GameCode.DB_ERROR), null);
            }else{
                return r[0]
            }
        })
    }
};