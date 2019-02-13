const DataAccess = require('dataAccess');
const Executor = DataAccess.executor;
const Command = DataAccess.command;
const REDIS_PLAYER_KEY = 'ZQ_PLAYER_KEY';
module.exports = {

    //获取用户信息
    getPlayerInfo : function(wxUid, cb){
        let key = `${REDIS_PLAYER_KEY}:${wxUid}`;
        Log.info(`try get Player Info key ${key}`);
        Executor.redisGet(DBEnv_ZQ, key, (e,r)=>{
            if(e){
                Log.error(`getPlayerInfo redis error ${e}`);
                cb(new Error(GameCode.REDIS_ERROR), null);
            }
            else{
                if(r){
                    Log.info(`getPlayerInfo from redis ${r}`);
                    cb(null, JSON.parse(r));
                }
                else{
                    let sql  = new Command('insert into player(wx_uid,createAt) values(?,?)',[wxUid,~~(new Date().getTime()/1000)]);
                    Executor.query(DBEnv_ZQ, sql, (e,r)=>{
                        if(e && e.code === "ER_DUP_ENTRY"){
                            let sql = new Command('select * from player where wx_uid = ?',[wxUid]);
                            Executor.query(DBEnv_ZQ, sql, (se,sr)=> {
                                if (se) {
                                    Log.error(`getPlayerInfo db error ${se}`);
                                    cb(new Error(GameCode.DB_ERROR), null);
                                }
                                else{
                                    let dbPlayer = sr[0];
                                    let userInfo = {
                                        uid: dbPlayer['id'],
                                        wx_uid: dbPlayer['wx_uid'],
                                        dungeon_level:dbPlayer['dungeon_level'],
                                    };
                                    Executor.redisSet(DBEnv_ZQ, key, JSON.stringify(userInfo), (e)=>{
                                        if(e){
                                            Log.error(`getPlayerInfo redis error ${e}`);
                                            cb(new Error(GameCode.REDIS_ERROR), null);
                                        }
                                        else{
                                            Log.info(`getPlayerInfo from db and insert into redis ${JSON.stringify(r)}`);
                                            cb(null, userInfo);
                                        }
                                    });
                                }
                            })
                        }
                        else if(!e){
                            let userInfo = {
                                uid: r['insertId'],
                                wx_uid: wxUid,
                                dungeon_level:'1_1_1'
                            };
                            Executor.redisSet(DBEnv_ZQ, key, JSON.stringify(userInfo), (e)=>{
                                if(e){
                                    Log.error(`getPlayerInfo redis error ${e}`);
                                    cb(new Error(GameCode.REDIS_ERROR), null);
                                }
                                else{
                                    Log.info(`getPlayerInfo from create and insert into redis ${JSON.stringify(r)}`);
                                    cb(null, userInfo);
                                }
                            });
                        }
                        else{
                            Log.error(`getPlayerInfo db error ${e}`);
                            cb(new Error(GameCode.DB_ERROR), null);
                        }
                    })
                }
            }
        })
    }
};