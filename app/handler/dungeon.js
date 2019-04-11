const DataAccess = require('dataAccess');
const Command = DataAccess.command;
const Executor = DataAccess.executor;
const Player = require('../model/game/play/player');
const CardGacha = require('../model/game/play/card/cardGacha');
const LevelBasic = require('../model/game/gconf/levelBasic');
const EnemyGacha = require('../model/game/gconf/enemyGacha');
const EnemyBase = require('../model/game/gconf/enemyBase');
const EnemyStatus = require('../model/game/gconf/enemyStatus');
const RoleBasic = require('../model/game/gconf/role');
const GlobalConf = require('../model/game/gconf/global');
const CryptoUtil = require('../../util/cryptoUtil');
let Enemy = require('../model/game/play/fight/enemy');
let Role = require('../model/game/play/fight/role');
module.exports = {

    nextLevel: function (req_p, ws) {
        let uid = req_p.rawData.uid;
        Player.getPlayerInfo(uid, (e, playerInfo) => {
            if (e) {
                BaseHandler.commonResponse(req_p, {code: e.message}, ws);
            }
            else {
                let d_level_info = playerInfo['dungeon_level'].split("_");
                let dId = ~~d_level_info[0];
                let levelM = ~~d_level_info[1];
                let level = ~~d_level_info[2];
                let curLevelBasic = LevelBasic.confByDungeonLevel(dId, levelM, level);
                if (!curLevelBasic) {
                    Log.info(`用户${uid}需要创建 LEVEL_BASIC_NOT_EXIST ${playerInfo['dungeon_level']}`);
                    return BaseHandler.commonResponse(req_p, {code: GameCode.LEVEL_BASIC_NOT_EXIST}, ws);
                }
                //(1)生成怪物
                let enemies = this.createLevelEnemies(curLevelBasic, uid, req_p, ws);
                if (enemies.length === 0) {
                    return BaseHandler.commonResponse(req_p, {code: GameCode.LEVEL_NO_ENEMIES}, ws);
                }
                //(2)生成角色
                this.createLevelRole(playerInfo, role => {
                    if (!role) {
                        return BaseHandler.commonResponse(req_p, {code: GameCode.CREATE_ROLE_ERROR}, ws);
                    }

                    //(3)随机没有位置的单位
                    let allUnits = [];
                    allUnits = allUnits.concat(enemies);
                    allUnits = allUnits.concat(role);
                    let existPos = [];
                    for (let i = 0; i < 7; i++) {
                        for (let j = 0; j < 9; j++) {
                            let need = true;
                            for (let k = 0; k < allUnits.length; k++) {
                                let unit = allUnits[k];
                                if (unit.posX === i && unit.posY === j) {
                                    need = false;
                                    break;
                                }
                            }
                            if (need) {
                                existPos.push({x: i, y: j});
                            }
                        }
                    }
                    for (let i = 0; i < allUnits.length; i++) {
                        let unit = allUnits[i];
                        if (!unit.posX && !unit.posY) {
                            this.randomUnitPos(existPos, unit);
                        }
                    }

                    this.hasUnFinishLevel(uid, req_p, ws, existDungeon => {
                        if (!existDungeon) {
                            //(4)记录当前生成的副本
                            this.createLevelRecord(playerInfo, role, enemies, (e, did) => {
                                if (e) {
                                    Log.error(`createLevelRecord db error ${e}`);
                                    return BaseHandler.commonResponse(req_p, {code: GameCode.DB_ERROR}, ws);
                                }
                                BaseHandler.commonResponse(req_p, {
                                    code: GameCode.SUCCESS, dungeonId: did, role: role, enemies: enemies,
                                    elements: curLevelBasic['SURFACE_ELEMENT'], globalConf: {
                                        a_factor: GlobalConf.getGlobalConf("A_FACTOR"),
                                        b_factor: GlobalConf.getGlobalConf("B_FACTOR"),
                                    }
                                }, ws);
                            })
                        }
                        else {
                            //存在则不需要记录
                            BaseHandler.commonResponse(req_p, {
                                code: GameCode.SUCCESS, dungeonId: existDungeon['id'], role: role, enemies: enemies,
                                elements: curLevelBasic['SURFACE_ELEMENT'], globalConf: {
                                    a_factor: GlobalConf.getGlobalConf("A_FACTOR"),
                                    b_factor: GlobalConf.getGlobalConf("B_FACTOR"),
                                }
                            }, ws);
                        }
                    });
                });
            }
        });
    },

    finishLevel: function (req_p, ws) {
        let uid = req_p.rawData.uid;
        let dungeonId = req_p.rawData.dungeonId;
        let result = req_p.rawData.result;
        let levelDamage = req_p.rawData.levelDamage;
        let levelRounds = req_p.rawData.levelRounds;
        let sql = new Command('select * from dungeon where id = ? and finishAt is null and uid = ?', [dungeonId, uid]);
        Executor.query(DBEnv_ZQ, sql, (e, r) => {
            if (e) {
                Log.error(`finishLevel db error ${e}`);
                BaseHandler.commonResponse(req_p, {code: GameCode.DB_ERROR}, ws);
            }
            else {
                if (r[0]) {
                    Player.getPlayerInfo(uid, (e, playerInfo) => {
                        if (e) {
                            BaseHandler.commonResponse(req_p, {code: e.message}, ws);
                        }
                        else {
                            let d_level_info = playerInfo['dungeon_level'].split("_");
                            let dId = ~~d_level_info[0];
                            let levelM = ~~d_level_info[1];
                            let level = ~~d_level_info[2];
                            let nextLevel = level + 1;
                            let curLevelBasic = LevelBasic.confByDungeonLevel(dId, levelM, nextLevel);
                            let sqls = [];
                            let cur = ~~(new Date().getTime() / 1000);
                            let hasNext = true;
                            let nextDungeonLevel = `${dId}_${levelM}_${nextLevel}`;
                            if (!curLevelBasic) {
                                Log.info(`用户 ${uid} 已经完成了所有关卡！${d_level_info}`);
                                hasNext = false;
                            }
                            let sql = new Command('update dungeon set finishAt = ?,state = ? where id = ? and finishAt is null', [cur, result, dungeonId]);
                            sqls.push(sql);
                            if(result === 1 && hasNext){
                                let sql1 = new Command('update player set dungeon_level = ? where wx_uid = ?', [nextDungeonLevel, uid]);
                                sqls.push(sql1);
                            }
                            else if(result === 2){
                                let temp = "1_1_1";
                                let sql1 = new Command('update player set dungeon_role = null, dungeon_level = ? where wx_uid = ?', [uid,temp]);
                                sqls.push(sql1);
                            }
                            else if(result === 3){
                                //退出啥都不干，再进来就是当前的role 状态和 level 层数
                            }

                            Executor.transaction(DBEnv_ZQ, sqls, (e, r) => {
                                if (e) {
                                    Log.error(`finishLevel db error ${e}`);
                                    BaseHandler.commonResponse(req_p, {code: GameCode.DB_ERROR}, ws);
                                }
                                else {
                                    let lootInfo = [];
                                    if(result === 1){
                                    		//比较本层平均伤害
                                    		Player.comparePlayerLevelDamage(uid,playerInfo['dungeon_level'],levelRounds,levelDamage);
                                        //胜利才掉落
                                        lootInfo = this.lootFunc(playerInfo);
                                        if(hasNext){
                                            playerInfo.dungeon_level = nextDungeonLevel;
                                        }
                                    }
                                    else if(result === 2){
                                        playerInfo.dungeon_level = "1_1_1";
                                        playerInfo.dungeon_role = null;
                                    }
                                    else if(result === 3){
                                        //退出啥都不干
                                    }
                                    Player.refreshCachePlayerInfo(playerInfo, e => {
                                        if (e) {
                                            Log.error(`finishLevel redis error ${e}`);
                                            BaseHandler.commonResponse(req_p, {code: GameCode.REDIS_ERROR}, ws);
                                        }
                                        else {
                                            BaseHandler.commonResponse(req_p, {
                                                code: GameCode.SUCCESS,
                                                hasNext: hasNext,
                                                lootInfo: lootInfo,
                                                result:result
                                            }, ws);
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
                else {
                    Log.info(`dungeon ${dungeonId} not exist ,can not finish`);
                    BaseHandler.commonResponse(req_p, {code: GameCode.DUNGEON_NOT_EXIST}, ws);
                }
            }
        });
    },

    lootFunc: function(playerInfo){
        let playerRole = playerInfo['role'];
        let base_gacha = CardGacha.roleBaseGacha(playerRole);
        if (!base_gacha) {
            Log.info( `No base gacha found when get loot cards by role: ${playerRole}`);
            return [];
        }
        else{
            return CardGacha.getLootCards(playerInfo['dungeon_level'], base_gacha['BASIC_CARDGROUPID']);
        }
    },

    createLevelEnemies: function (curLevelBasic, uid, req_p, ws) {
        //(1)生成怪物
        let dId = curLevelBasic["ID"];
        let levelM = curLevelBasic["STAGE"];
        let level = curLevelBasic["STAGE_NUM"];
        let monsterLotteryIDs = curLevelBasic['MONSTER_LOTTERY'];
        Log.info(`需要为用户生成 ${uid} 当前 关卡 ${dId} 层级 ${levelM} 层数 ${level} 怪物库为:${monsterLotteryIDs}`);
        //先抽pool
        let lids = monsterLotteryIDs.split(',');
        let monsterLotteryID = 0;
        if (lids.length === 1) {
            monsterLotteryID = lids[0];
        }
        else if (lids.length > 1) {
            let random = CryptoUtil.rnd(0, 10000);
            Log.info(`lottery enemies random ${random}`);
            let lastEnd = 0;
            for (let i = 0; i < lids.length; i++) {
                let lid = lids[i].split(['#']);
                let offset = ~~lid[0];
                let mlId = lid[1];
                let begin = lastEnd;
                let end = lastEnd + offset - 1;
                lastEnd = lastEnd + offset;
                if (random >= begin && random <= end) {
                    monsterLotteryID = mlId;
                    break;
                }
            }
        }
        Log.info(`最终怪物抽奖ID 为 ${monsterLotteryID}`);

        let eLotteryPool = EnemyGacha.enemyLotteryPool(monsterLotteryID);
        if (eLotteryPool.length === 0) {
            Log.info(`enemy_gacha ${monsterLotteryID} not exist`);
            return []
        }
        let random = CryptoUtil.rnd(0, 10000);
        let resultEL = null;
        let lastRate = 0;
        for (let i = 0; i < eLotteryPool.length; i++) {
            let el = eLotteryPool[i];
            el.BEGIN_RATE = lastRate;
            el.END_RATE = el.BEGIN_RATE + el.RATE - 1;
            lastRate = el.END_RATE + 1;

            if (random >= el.BEGIN_RATE && random <= el.END_RATE) {
                resultEL = el;
                break;
            }
        }
        let enemyIDS = resultEL['ENEMY_ID'].split('#');
        let enemyPoses = curLevelBasic['MONSTER_POSITION'] ? curLevelBasic['MONSTER_POSITION'].split('#') : [];
        Log.info(`随机数为 ${random} monster 抽取结果为 ${JSON.stringify(resultEL)} 怪物ID 为 ${enemyIDS} 可选位置为 ${enemyPoses}`);
        let enemies = [];
        for (let i = 0; i < enemyIDS.length; i++) {
            let eId = enemyIDS[i];
            let eConf = EnemyBase.enemy(eId);
            if (eConf) {
                let kind = eConf['ENEMY_STATUS_KIND'];
                let baseAttr = EnemyStatus.baseAttribute(kind);
                if (baseAttr) {
                    let pos = enemyPoses[i];
                    let e = new Enemy(eConf, baseAttr, pos);
                    enemies.push(e);
                }
                else {
                    Log.info(`不存在kind ${kind} 的 enemyStatus！`);
                }
            }
            else {
                Log.info(`不存在id ${eId} 的怪物！`);
            }
        }
        return enemies;
    },

    createLevelRole: function (playerInfo, cb) {
        let roleId = playerInfo['role'];
        let dungeon_role = playerInfo['dungeon_role'];
        if (!dungeon_role) {
            Log.info(`try create role ${roleId} dungeon_role ${dungeon_role}`);
            Log.info(`init dungeon role...`);
            return cb(new Role(RoleBasic.roleConf(roleId), "3,1"));
        }
        else {
            Log.info(`dungeon_role ${dungeon_role} exist try get`);
            let sql = new Command('select roleInfo from dungeon_role where id = ?', [dungeon_role]);
            Executor.query(DBEnv_ZQ, sql, (e, r) => {
                if (e || !r[0]) {
                    return cb(null)
                }
                else {
                    cb(JSON.parse(r[0]['roleInfo']))
                }
            })
        }
    },

    createLevelRecord: function (playerInfo, role, enemies, cb) {
        Log.info(`createLevelRecord playerInfo:${JSON.stringify(playerInfo)}`);
        Log.info(`createLevelRecord role:${JSON.stringify(role)}`);
        Log.info(`createLevelRecord enemies:${JSON.stringify(enemies)}`);
        let cur = ~~(new Date().getTime() / 1000);
        let sql = new Command('insert into dungeon(uid, dungeon_level, createAt) values(?,?,?)', [playerInfo.wx_uid, playerInfo.dungeon_level, cur]);
        let sql1 = new Command('insert into dungeon_role(roleInfo, createAt, did) values(?,?,?)', [JSON.stringify(role), cur]);
        sql1.exeBefore = function () {
            let did = this.lastResult['insertId'];
            sql1.params.push(did);
        };
        let sql2 = new Command('update player set dungeon_role = ? where wx_uid = ?', []);
        sql2.exeBefore = function () {
            let dungeon_role = this.lastResult['insertId'];
            sql2.params.push(dungeon_role);
            sql2.params.push(playerInfo.wx_uid);
            playerInfo.dungeon_role = dungeon_role;
            Player.refreshCachePlayerInfo(playerInfo)
        };
        Executor.transaction(DBEnv_ZQ, [sql, sql1, sql2], (e, r) => {
            cb(e, r[0]['insertId']);
        })
    },

    hasUnFinishLevel: function (uid, req_p, ws, cb) {
        let sql = new Command('select * from dungeon where uid = ? and finishAt is NULL', [uid]);
        Executor.query(DBEnv_ZQ, sql, (e, r) => {
            if (e) {
                return BaseHandler.commonResponse(req_p, {code: GameCode.GET_PLAYER_DUNGEON_ERROR}, ws);
            }
            else {
                cb(r[0]);
            }
        })
    },

    randomUnitPos: function (existPos, unit) {
        Log.info(`randomUnitPos ...`);
        Log.info(unit);
        let randomIndex = CryptoUtil.rnd(0, existPos.length);
        let randPos = existPos[randomIndex];
        unit.posX = randPos.x;
        unit.posY = randPos.y;
        existPos.splice(randomIndex, 1);
        Log.info(`random pos ${JSON.stringify(randPos)}`);
    }
};