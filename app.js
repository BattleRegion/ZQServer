require('./util/global');
const Server = require('./net/server');
const dataAccess = require('dataAccess');
dataAccess.setPoolConfig(require('./conf/mysql'));
dataAccess.setRedisConfig(require('./conf/redis'));
const GameConf = require('./app/gameConf/index');
GameConf.refreshGameConf(success=>{
    console.log(success);
    if(success){
        Server.startServer(process.argv[3]?process.argv[3]:CommonConf['server_port']);
    }
});