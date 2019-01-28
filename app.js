require('./util/global');
const Server = require('./net/server');
console.log(process.argv);
let port = process.argv[3]?process.argv[3]:5555;
Server.startServer(port);