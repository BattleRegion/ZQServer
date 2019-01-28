const RequestPackage = require('../model/net/reqPackage');
const ResPackage = require('../model/net/resPackage');
const Request = require('request');
const WebSocket = require('ws');
const filterVerify = {
    "user_debugLogin":true,
    "sys_heartbreak":true
};

module.exports = {

    parseReqPackage: function(data, ws) {
        let req_p = new RequestPackage(data);
        if(req_p['legal']){
            if(req_p.handler !== "sys" && req_p.event !== "heartbreak"){
                Log.info(`服务器收到正确数据包 : ${JSON.stringify(req_p)}`);
            }
            let handlerName = req_p.handler;
            try {
                let event = req_p.event;
                this.verifyToken(handlerName, event, req_p.rawData.token, result=>{
                    if(result){
                        let handler = require(`../../app/handler/${handlerName}`);
                        if(handler[event]){
                            if(result !== true){
                                req_p.rawData.uid = result.toString();
                            }
                            if(handlerName !== "sys" && event !== "heartbreak"){
                                Log.info(`尝试处理数据包 ${handlerName} ${event} ${JSON.stringify(req_p.rawData)}`);
                            }
                            handler[event](req_p, ws);
                        }
                        else{
                            Log.info(`不存在 客户端 ${ws.realAddress} 发送的 handler : ${handlerName} event: ${event}`);
                        }
                    }
                    else{
                        Log.info(`token error!!`);
                    }
                });
            }
            catch (e) {
                Log.info(`不存在 客户端 ${ws.realAddress} 发送的 handler : ${handlerName}`);
            }
        }
        else{
            Log.info(`服务器收到客户端 ${ws.realAddress} 非法数据包 : ${data}`);
        }
    },

    sendToClient: function(resPackage, ws){
        if(ws && ws.readyState === WebSocket.OPEN) {
            if(resPackage.handler !== "sys" && resPackage.event !== "heartbreak"){
                Log.info(`发送消息到客户端 ${ws.realAddress} 消息内容 : ${JSON.stringify(resPackage)}`);
            }
            ws.send(JSON.stringify(resPackage));
        }
        else{
            Log.error(`连接不是打开状态无法发送消息`);
            ServerManager.cleanWs(ws);
        }
    },

    verifyToken: function(handler, event, token, cb){
        let apiStr = `${handler}_${event}`;
        Log.info(`尝试验证token : ${token} ${apiStr}`);
        if(!filterVerify[apiStr]){
            let url = "https://wxlogin.magiclizi.com";
            let postBody = {
                url: `${url}/verifyToken`,
                form: {token:token,gameTag:'darkChess'},
            };
            Request.post(postBody,(err,response,body)=>{
                if(err){
                    Log.error(`验证token:${token}失败:${err.toString()}`);
                    cb(false)
                }
                else{
                    let bodyInfo = JSON.parse(body);
                    Log.info(`verify token result ${body}`);
                    if(bodyInfo["code"] === GameCode.SUCCESS){
                        let uid = bodyInfo.data.uid;
                        Log.info(`验证 token:${token} 成功 uid:${uid}`);
                        cb(uid)
                    }
                    else{
                        cb(false)
                    }
                }
            })
        }
        else{
            Log.info(`${apiStr} 不需要验证`);
            cb(true);
        }
    },

    commonResponse: function(req_p, rawData ,ws){
        let res_p = new ResPackage({
            handler:req_p.handler,
            event:req_p.event,
            rawData:rawData
        });
        BaseHandler.sendToClient(res_p, ws);
    }
};