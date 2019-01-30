const WebSocket = require('ws');
const CryptoUtil = require('../util/cryptoUtil');
const sign = require('../conf/common')['package_md5_key'];
class Base {
    constructor(env){
        this.userToken = '7c59b0f7e0fc00aa489cf004e45d6f7ad27039a8eccccc191e5f019041b84f24e1165ae7d950011e3faffc8e1d12b425';
        this.url = env === "prod"?"wss://zq.magiclizi.com":"ws://127.0.0.1:9999";
        this.ws = new WebSocket(this.url);

        this.msgHandler = null;

        let self = this;

        this.ws.on('open', function open() {
            console.log(`open :${self.url}`);
            self.test();
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