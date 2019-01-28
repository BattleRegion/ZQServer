const log4js = require('log4js');
const moment = require('moment');
log4js.configure({
    appenders: {
        'debug': {
            type: "file",
            filename: `logs/debug/${moment(new Date()).format("YYYYMMDD")}.log`,
            maxLogSize: 500 * 1024 * 1024, // = 10Mb
        },
        'info': {
            type: "file",
            filename: `logs/info/${moment(new Date()).format("YYYYMMDD")}.log`,
            maxLogSize: 500 * 1024 * 1024, // = 10Mb
        },
        'error': {
            type: "file",
            filename: `logs/error/${moment(new Date()).format("YYYYMMDD")}.log`,
            maxLogSize: 500 * 1024 * 1024, // = 10Mb
        },
        stdout: {
            type: "stdout"
        }
    },

    categories: {
        default: { appenders: ["stdout"], level: "debug" },
        debug: { appenders: ["stdout","debug"], level: "debug" },
        info: { appenders: ["stdout","info"], level: "info" },
        error: { appenders: ["stdout","error"], level: "error" },
    }
});

module.exports = {

    debug: function(msg) {
        let logger = log4js.getLogger("debug");
        logger.debug(msg);
    },

    info: function(msg) {
        let logger = log4js.getLogger("info");
        logger.info(msg);
    },

    error: function(msg) {
        let logger = log4js.getLogger("error");
        logger.error(msg);
    }
};