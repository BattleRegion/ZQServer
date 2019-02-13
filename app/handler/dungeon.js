const DataAccess = require('dataAccess');
const Command = DataAccess.command;
const Executor = DataAccess.executor;
const Player = require('../model/game/play/player');
const LevelBasic = require('../model/game/gconf/levelBasic');
const EnemyGacha = require('../model/game/gconf/enemyGacha');
const EnemyBase = require('../model/game/gconf/enemyBase');
const EnemyStatus = require('../model/game/gconf/enemyStatus');
const CryptoUtil = require('../../util/cryptoUtil');
let Enemy = require('../model/game/play/fight/enemy');
let Mine = require('../model/game/play/fight/mine');
module.exports = {

    nextLevel:function(req_p, ws){
        let uid = req_p.rawData.uid;
        Player.getPlayerInfo(uid, (e,r)=>{
            if(e){
                BaseHandler.commonResponse(req_p, {code:e.message},ws);
            }
            else{
                let d_level_info = r['dungeon_level'].split("_");
                let dId = ~~d_level_info[0];
                let levelM = ~~d_level_info[1];
                let level = ~~d_level_info[2];
                let curLevelBasic = LevelBasic.confByDungeonLevel(dId, levelM, level);
                if(!curLevelBasic){
                    Log.info(`用户${uid}需要创建 LEVEL_BASIC_NOT_EXIST ${r['dungeon_level']}`);
                    return BaseHandler.commonResponse(req_p, {code:GameCode.LEVEL_BASIC_NOT_EXIST},ws);
                }

                let monsterLotteryID = curLevelBasic['MONSTER_LOTTERY'];
                //(1)生成怪物
                Log.info(`需要为用户生成 ${uid} 当前 关卡 ${dId} 层级 ${levelM} 层数 ${level} 怪物库为:${monsterLotteryID}`);
                let eLotteryPool = EnemyGacha.enemyLotteryPool(monsterLotteryID);
                if(eLotteryPool.length === 0){
                    Log.info(`enemy_gacha ${monsterLotteryID} not exist`);
                    return BaseHandler.commonResponse(req_p, {code:GameCode.Enemy_Gacha_NOT_EXIST},ws);
                }

                let random = CryptoUtil.rnd(0, 100) * 100;
                let resultEL = null;
                let lastRate = 0;
                for(let i = 0;i<eLotteryPool.length;i++){
                    let el = eLotteryPool[i];
                    el.BEGIN_RATE = lastRate;
                    el.END_RATE = el.BEGIN_RATE + el.RATE - 1;
                    lastRate = el.END_RATE + 1;

                    if(random >=el.BEGIN_RATE && random <= el.END_RATE){
                        resultEL = el;break;
                    }
                }
                let enemyIDS = resultEL['ENEMY_ID'].split('\r\n');
                let enemyPoses = curLevelBasic['MONSTER_POSITION'].split('#');
                Log.info(`随机数为 ${random} monster 抽取结果为 ${JSON.stringify(resultEL)} 怪物ID 为 ${enemyIDS} 可选位置为 ${enemyPoses}`);
                let enemies = [];
                for(let i = 0;i<enemyIDS.length;i++){
                    let eId = enemyIDS[i];
                    let eConf = EnemyBase.enemy(eId);
                    if(eConf){
                        let kind = eConf['ENEMY_STATUS_KIND'];
                        let baseAttr = EnemyStatus.baseAttribute(kind);
                        if(baseAttr){
                            let pos = enemyPoses[i];
                            let e = new Enemy(eConf, baseAttr, pos);
                            enemies.push(e);
                        }
                        else{
                            Log.info(`不存在kind ${kind} 的 enemyStatus！`);
                        }
                    }
                    else{
                        Log.info(`不存在id ${eId} 的怪物！`);
                    }
                }

                console.log(enemies);

                //(*)随机没有位置的单位
                let allUnits = [];
                allUnits = allUnits.concat(enemies);

                for(let i = 0;i<allUnits.length;i++){

                }

                this.randomUnitPos(allUnits);
            }
        });
    },

    randomUnitPos:function(allUnits){
        Log.info(`randomUnitPos ${JSON.stringify(allUnits)}`);
        let allPos = {};
        for(let i = 0; i<7;i++){
            for(let j = 0;j<9;j++){
                let need = true;
                for(let k = 0;k<allUnits.length;k++){
                    let unit = allUnits[k];
                    if(unit.posX === i && unit.posY === j){
                        need = false;break;
                    }
                }

                if(need){
                    allPos.push({x:i,y:j});
                }
            }
        }

        //去除已经存在的
        console.log(allPos);
    }
};