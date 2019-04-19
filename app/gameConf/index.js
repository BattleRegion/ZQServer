const DataAccess = require('dataAccess');
const Command = DataAccess.command;
const Executor = DataAccess.executor;
const VERSION_PATH = `${__dirname}/v.json`;
const fs = require('fs');
const path = require('path');
const request = require('request');
const decompress = require('decompress');
const decompressUnzip = require('decompress-unzip');
const download = require('download');

module.exports = {

    refreshGameConf:function(cb){
        Log.info(`开始更新游戏配置！`);
        let sql = new Command('select * from gameconf where valid = 1 order by version desc',[]);
        Executor.query(DBEnv_ZQ, sql, (e,r)=>{
            if(e){
                Log.error(`refreshConf db error ${e}`);
                return cb(false);
            }
            let svConf = r[0];
            let svVersion = svConf['version'];
            let needUpdate = false;
            let v = 0;
            if(!fs.existsSync(VERSION_PATH)){
                let versionConf = {
                    version:svVersion
                };
                fs.writeFileSync(VERSION_PATH, JSON.stringify(versionConf));
                needUpdate = true;
            }
            else{
                let vConf = JSON.parse(fs.readFileSync(VERSION_PATH));
                v = vConf['version'];
                if(svVersion > v){
                    let versionConf = {
                        version:svVersion
                    };
                    fs.writeFileSync(VERSION_PATH, JSON.stringify(versionConf));
                    needUpdate = true;
                }
            }

            Log.info(`dbversion:${svVersion} curversion:${v} 是否需要更新:${needUpdate}`);
            if(needUpdate){
                let url = svConf['url'];
                let dist = `${__dirname}/${path.basename(url)}`;
                Log.info(`download path ${url} to ${dist}`);
                download(url, __dirname).then(() => {
                    //unzip to
                    decompress(dist, `${__dirname}/${path.basename(dist, ".zip")}`, {
                        plugins: [
                            decompressUnzip()
                        ]
                    }).then(() => {
                        Log.info(`Files decompressed remove zip ${dist}`);
                        fs.unlinkSync(dist);
                        Log.info(`clear files rename new to files`);

                        let confPath = `${__dirname}/files`;
                        if (fs.existsSync(confPath)){
                            let files = fs.readdirSync(`${confPath}`);
                            files.forEach(function(file, index) {
                                let curPath = confPath + "/" + file;
                                fs.unlinkSync(curPath);
                            });
                        }

                        fs.rename(`${__dirname}/${path.basename(url, '.zip')}`, `${confPath}`, function(err) {
                            if(err){
                                Log.info(err)
                            }
                            else{
                                cb(true);
                            }
                        });
                    }).catch(e=>{
                        Log.error(`zip error`)
                        Log.error(e);
                    });
                }).catch(e=>{
                    Log.error(`download update error!`);
                    Log.error(e);
                });

            }
            else{
                cb(true);
            }
        })
    }
};