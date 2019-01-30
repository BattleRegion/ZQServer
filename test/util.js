const CryptoUtil = require('../util/cryptoUtil');
const TOKEN_KEY = `23840e5ba50f3ea501f35c7cb5076126b98bab4cdc48c5d6801d3d05e26053f6ca4586ae3044a33a9c80f059a4181ee77dec2cc128f72f8f73669269bf49af43`;

function genToken(openid,gameTag){
    let origin = `${openid}$${gameTag}$${new Date().getTime()}`;
    let token = CryptoUtil.toSecret(`${origin}`,TOKEN_KEY);
    let key = "WXUSERTOKEN" + ":" + openid + gameTag;
    console.log(token);
    console.log(key);
}

genToken("oC_No5I2MH8f_9Stbm9rfucMMFvA","zq");