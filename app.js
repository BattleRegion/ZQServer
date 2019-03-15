require('./util/global');
const Server = require('./net/server');
const GameConf = require('./app/gameConf/index');

GameConf.refreshGameConf(success=>{
    if(success){
        const dataAccess = require('dataAccess');
        dataAccess.setPoolConfig(require('./conf/mysql'));
        dataAccess.setRedisConfig(require('./conf/redis'));
        Server.startServer(process.argv[3]?process.argv[3]:CommonConf['server_port']);
    }
    else{
        Log.error(`refreshGameConf error!`);
    }
});