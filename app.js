require('./util/global');
const Server = require('./net/server');
const GameConf = require('./app/gameConf/index');
const dataAccess = require('dataAccess');
dataAccess.setPoolConfig(require('./conf/mysql'));
dataAccess.setRedisConfig(require('./conf/redis'));
GameConf.refreshGameConf(success=>{
    if(success){
        Server.startServer(process.argv[3]?process.argv[3]:CommonConf['server_port']);
    }
    else{
        Log.error(`refreshGameConf error!`);
    }
});