const WebSocket = require('ws');

module.exports = {

    curServer: null,

    userWs: {},

    //开启服务器
    startServer: function(port) {

        const server_opts = {
            port: port
        };

        const webSocketServer = new WebSocket.Server(server_opts);

        this.curServer = webSocketServer;

        Log.info(`server listen ${port}`);

        webSocketServer.on("connection", (ws,req)=>{
            let address = req.headers['x-real-ip'] || ws._socket['remoteAddress'];
            ws.realAddress = `${address}:${ws._socket['remotePort']}`;
            Log.info(`客户端 ${ws.realAddress} 连接成功`);
            ws.on("message", data=>{
                Log.debug(`ws client receive msg ${data}`);
                BaseHandler.parseReqPackage(data, ws);
            });

            ws.on("close", (code, reason)=>{
                this.cleanWs(ws);
                Log.info(`客户端 ${ws.realAddress} 断开 code ${code} reason ${reason}`);
            });

            ws.on("error", e=>{
                this.cleanWs(ws);
                Log.error(`ws client error ${e}`);
            });
        });

        webSocketServer.on("error", error=>{
            Log.error(`ws server error ${error}`);
            this.curServer = null;
            this.userWs = {};

        });

        webSocketServer.on("close", ()=>{
            Log.info(`ws server close`);
            this.curServer = null;
            this.userWs = {};

        });
    },

    //绑定用户 到 ws
    bindUser : function(uid, ws){
        //存储用户信息
        Log.info(`绑定用户 ${uid}  到 ws 当前用户数量 ${Object.keys(this.userWs).length}`);
        if(this.getWsByUid(uid)){
            this.kickUser(uid);
        }
        this.userWs[uid] = ws;
    },

    //踢掉重复登陆的用户
    kickUser : function(uid){
        let ws = this.getWsByUid(uid);
        if(ws) {
            Log.info(`用户 ${uid} 在其他地方登陆将其踢下线`);
            ws.close();
            delete this.userWs[uid];
        }
    },

    //通过ws 获取 uid
    getUidByWs: function(ws)  {
        let keys = Object.keys(this.userWs);
        for(let i = 0;i<keys.length;i++){
            let key = keys[i];
            let v = this.userWs[key];
            if(v === ws){
                return key;
            }
        }
        return null;
    },

    //通过uid 获取ws
    getWsByUid : function(uid) {
        return this.userWs[uid];
    },

    //清理 ws
    cleanWs: function(ws){
        let uid = this.getUidByWs(ws);
        if(uid){
            ws.close();
            delete this.userWs[uid];
            Log.info(`清理用户 ${uid} 的 ws 链接 剩余用户数量 ${Object.keys(this.userWs).length}`);
        }
    }
};