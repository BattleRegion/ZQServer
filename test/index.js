let apiName = process.argv[2];
let env = process.argv[3]?process.argv[3]:'dev';
console.log(`test:${apiName} env:${env}`);
let c = require(`./${apiName}`);
new c(env,data=>{

});