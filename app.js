require('./util/global');
const Server = require('./net/server');
const dataAccess = require('dataAccess');
dataAccess.setPoolConfig(require('./conf/mysql'));

let port = process.argv[3]?process.argv[3]:CommonConf['server_port'];
Server.startServer(port);