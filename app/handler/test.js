const BaseHandler = require('./base');
module.exports = {

    check:(req_p, ws) =>{
        BaseHandler.commonResponse(req_p, req_p.rawData, ws);
    },
};