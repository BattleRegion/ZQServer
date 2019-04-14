const DataAccess = require('dataAccess');
const Executor = DataAccess.executor;
const Command = DataAccess.command;
const levelConf = require('./dungeon');
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
                            let sql = new Command('select * from player t1,player_avatar t2 where t1.wx_uid = ?',[wxUid],'and t2.wx_uid = ?',[wxUid]);
                            Executor.query(DBEnv_ZQ, sql, (se,sr)=> {
                                if (se) {
                                    Log.error(`getPlayerInfo db error ${se}`);
                                    cb(new Error(GameCode.DB_ERROR), null);
                                }
                                else{
                                    let dbPlayer = sr[0];
                                    let playerAvatar = {weapon:dbPlayer['weapon'],deputy:dbPlayer['deputy'],head:dbPlayer['head'],body:dbPlayer['body']}
                                    let userInfo = {
                                        uid: dbPlayer['id'],
                                        wx_uid: dbPlayer['wx_uid'],
                                        dungeon_level:dbPlayer['dungeon_level'],
                                        dungeon_role:dbPlayer['dungeon_role'],
                                        role:dbPlayer['role'],
                                        avatar:playerAvatar
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
                                avatar:{weapon: 700_001_10000,head: 700_001_10001,body: 700_001_10002}
                            };
                            let insertAvatar  = new Command('insert into player_avatar(wx_uid,weapon,head,body,createAt) values(?,?,?,?,?)',[wxUid,700_001_10000,700_001_10001,700_001_10002,~~(new Date().getTime()/1000)]);
                            Executor.query(DBEnv_ZQ, insertAvatar,(e1)=>{
                                Executor.redisSet(DBEnv_ZQ, key, JSON.stringify(userInfo), (e2)=>{
                                    if(e2){
                                        Log.error(`getPlayerInfo redis error ${e2}`);
                                        cb(new Error(GameCode.REDIS_ERROR), null);
                                    }
                                    else{
                                        Log.info(`getPlayerInfo from create and insert into redis ${JSON.stringify(r)}`);
                                        cb(null, userInfo);
                                    }
                                });
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
    comparePlayerLevelDamage: function(wxUid, level, nextLevel, roundNum, damage){
        let rounds = parseInt(roundNum);
    		//取出用户所有关卡所有层的伤害条目
        let sql  = new Command('select * from player_damage where wx_uid=?',[wxUid]);
        Executor.query(DBEnv_ZQ, sql, (e,r)=> {
			if(e) {
				Log.error(`getPlayerLevelDamage db error ${se}`);
				return new Error(GameCode.DB_ERROR);
			} else {
				if(r) {
					let findLevelDamageChange = false;
					let findLevelDamage = false;
					//用户当前关卡
					let currentDungeon = level.split('_')[0];
					let nextDungeon = nextLevel.split('_')[0];
					let totalDamage = 0;
					let plus = 0;
					for (let i = 0; i < r.length; i++) {
						let piece = r[i];
						if(piece['level'].split('_')[0] == currentDungeon) {
							//计算当前关卡各层平均伤害总和
							totalDamage += piece['avg_damage'];
							plus += 1;
						}
						if(piece['level'] == level) {
							let thisDamage = Math.round(damage/rounds);
							if(thisDamage > piece['avg_damage']) {
								//当前层平均伤害高于原来记录的当前层平均伤害，则覆盖
								let gtSql  = new Command('update player_damage set avg_damage=?, createAt=? where wx_uid=? and level=?',[thisDamage,~~(new Date().getTime()/1000),wxUid,level]);
								Executor.query(DBEnv_ZQ, gtSql, (e,r)=> {
									if(e) {
										Log.error(`update player damage db error ${se}`);
										return new Error(GameCode.DB_ERROR);
									} else {
										findLevelDamageChange = true;
										//计算当前关卡各层伤害总和时需要更新当前层平均伤害
										totalDamage = totalDamage - piece['avg_damage'] + thisDamage;
										plus -= 1;
									}
								})
							}
							findLevelDamage = true;
						}
					}
					let dungeonAvgDamage = Math.round(totalDamage/plus);
					//当前层平均伤害高于原来记录的当前层平均伤害，则需要更新用户当前关卡的总平均伤害
					if(findLevelDamageChange || nextDungeon == currentDungeon+1) {
						let dSql  = new Command('insert into dungeon_damage(wx_uid,dungeon,round_damage,createAt) values(?,?,?,?) ON DUPLICATE KEY UPDATE round_damage=?',[wxUid,currentDungeon,dungeonAvgDamage,~~(new Date().getTime()/1000),dungeonAvgDamage]);
						Executor.query(DBEnv_ZQ, dSql, (e, r) => {
							if(e) {
								Log.error(`insert dungeon damage db error ${se}`);
								return new Error(GameCode.DB_ERROR);
							} else {
								return true;
							}
						})
					}
					//数据库中没找到当前关卡当前层平均伤害，则插入
					if(!findLevelDamage){
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
    
    getDamageRanking: function(wxUid, cb){
    		let totalDungeon = levelConf.getTotalDungeon();
    		let sql  = new Command('select * from dungeon_damage', []);
        Executor.query(DBEnv_ZQ, sql, (e,r)=> {
			if(e) {
				Log.error(`getDamageRanking db error ${se}`);
				cb(new Error(GameCode.DB_ERROR), null);
			} else {
				if(r) {
					Log.info(`getDamageRanking success`);
					let rankDict = {};
					for (let i = 0; i < r.length; i++) {
						let record = r[i];
						let uid = record['wx_uid'];
						if (!rankDict.hasOwnProperty(record['dungeon'])) {
							rankDict[record['dungeon']] = [];
						}
						rankDict[record['dungeon']].push({'player': record['wx_uid'], 'damage': record['round_damage']});
					}
					let ranks = Object.keys(rankDict);
					for (let i = 0; i < ranks.length; i++) {
						let rank = ranks[i];
						let rankDetail = rankDict[rank];
						rankDetail.sort((a,b) => (a.damage > b.damage) ? 1 : ((b.damage > a.damage) ? -1 : 0));
					}
					Log.info(`getDamageRanking ${JSON.stringify(rankDict)}`);
					cb(null, rankDict);
				} else {
					cb(null, false);
				}
			}
		})
    }
};