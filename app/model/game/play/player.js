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
                                        dungeon_role:dbPlayer['dungeon_role'],
                                        role:dbPlayer['role']
                                    };
                                    Executor.redisSet(DBEnv_ZQ, key, JSON.stringify(userInfo), (e)=>{
                                        if(e){
                                            Log.error(`getPlayerInfo redis error ${e}`);
                                            cb(new Error(GameCode.REDIS_ERROR), null);
                                        }
                                        else{
                                            Log.info(`getPlayerInfo from db and insert into redis ${JSON.stringify(userInfo)}`);
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
                                dungeon_level:'1_1_1',
                                role:1,
                                dungeon_role:null,
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
    },

    //设置用户缓存信息
    refreshCachePlayerInfo: function(playerInfo, cb){
        let key = `${REDIS_PLAYER_KEY}:${playerInfo.wx_uid}`;
        Executor.redisSet(DBEnv_ZQ, key, JSON.stringify(playerInfo), e=>{
            if(e){
                Log.error(`refreshCachePlayerInfo error ${e}`);
            }
            cb&&cb(e);
        })
    },
    
    //获取用户关卡层伤害
    comparePlayerLevelDamage: function(wxUid, level, rounds, damage){
    		let rounds = parseInt(rounds);
        let sql  = new Command('select * from player_damage where wx_uid=? and level=?',[wxUid, level]);
        Executor.query(DBEnv_ZQ, sql, (e,r)=> {
			if(e) {
				Log.error(`getPlayerLevelDamage db error ${se}`);
				return new Error(GameCode.DB_ERROR);
			} else {
				if(r[0]) {
					let playerInfo = r[0];
					let thisDamage = Math.round(damage/rounds);
					if(thisDamage > playerInfo['avg_damage']) {
						let gtSql  = new Command('update player_damage set avg_damage=?, createAt=? where wx_uid=? and level=?) values(?,?,?,?,?)',[thisDamage,~~(new Date().getTime()/1000),wxUid,level]);
						Executor.query(DBEnv_ZQ, gtSql, (e,r)=> {
							if(e) {
								Log.error(`update player damage db error ${se}`);
								return new Error(GameCode.DB_ERROR);
							} else {
								return true;
							}
						})
					}
				} else {
					let playerDamage = Math.round(damage/rounds);
					let iSql  = new Command('insert into player_damage(wx_uid,level,rounds,avg_damage,createAt) values(?,?,?,?,?)',[wxUid,level,rounds,playerDamage,~~(new Date().getTime()/1000)]);
					Executor.query(DBEnv_ZQ, iSql, (e, r) => {
						if(e) {
							Log.error(`insert player damage db error ${se}`);
							return new Error(GameCode.DB_ERROR);
						} else {
							return true;
						}
					})
				}
			}
		})
    },
};