const dataAccess = require('dataAccess');
const Command = dataAccess.command;
const Executor = dataAccess.executor;

module.exports = {

    info:(req_p, ws) =>{
        let uid = req_p.rawData.uid;
        let sql  = new Command('insert into player(wx_uid,createAt) values(?,?)',[uid,~~(new Date().getTime()/1000)]);
        Executor.query(CommonConf['env'], sql, (e,r)=>{
            if(e && e.code === "ER_DUP_ENTRY"){
                let sql = new Command('select * from player where wx_uid = ?',[uid]);
                Executor.query(CommonConf['env'], sql, (se,sr)=> {
                    if (se) {
                        Log.info(se.toString());
                        BaseHandler.commonResponse(req_p, {
                            code:GameCode.PLAYER_INFO_ERROR
                        } , ws);
                    }
                    else{
                        BaseHandler.commonResponse(req_p, {
                            code:GameCode.SUCCESS,
                            sUid:sr[0].id
                        } , ws);
                    }
                })
            }
            else if(!e){
                let sUid = r['insertId'];
                BaseHandler.commonResponse(req_p, {
                    code:GameCode.SUCCESS,
                    sUid:sUid
                } , ws);
            }
            else{
                Log.info(e.toString());
                BaseHandler.commonResponse(req_p, {
                    code:GameCode.PLAYER_INFO_ERROR
                } , ws);
            }
        })
    },

    //绑定用户
    bindPlayer:(req_p, ws) =>{
        let rawData = req_p.rawData;
        let uid = rawData['uid'].toString();
        ServerManager.bindUser(uid, ws);
        Log.info(`用户:${uid} 绑定成功`);
        BaseHandler.commonResponse(req_p, {
            code: GameCode.SUCCESS,
        },ws)
    }
};