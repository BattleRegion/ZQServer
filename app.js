require('./util/global');
const Server = require('./net/server');
let port = process.argv[3]?process.argv[3]:CommonConf['server_port'];
Server.startServer(port);