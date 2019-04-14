const WebSocket = require('ws');
const CryptoUtil = require('../util/cryptoUtil');
const sign = require('../conf/common')['package_md5_key'];
class Base {
    constructor(env, handler){
        this.userToken = '97bda6faae5432bc37655b47e08e59c66e35b9209e3c359c7fcdcb36a521e27df3a468ab2823d3f93aaed043949de33c';
        this.url = env === "prod"?"wss://zq.magiclizi.com":"ws://127.0.0.1:9999";
        this.ws = new WebSocket(this.url);

        this.msgHandler = null;

        let self = this;

        this.ws.on('open', function open() {
            console.log(`open :${self.url}`);
            handler();
        });

        this.ws.on('message', function incoming(data) {
            console.log(`收到数据:${data}`);
            self.msgHandler&&self.msgHandler(data);
        });

        this.ws.on('close', function() {
            console.log('close')
        });
    }

    test(){
        // this.ws.close();
    }

    send(param){
        console.log(`发送数据:${JSON.stringify(param)}`);
        let objStr = Object.keys(param).filter(k => {
            if(param[k]){
                return k;
            }
            return null;
        }).sort().map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(param[key])
        }).join('&');
        let md5Str = `${objStr}_${sign}`;
        param.crc = CryptoUtil.toMD5(md5Str);
        this.ws.send(JSON.stringify(param));
    }
}

module.exports = Base;