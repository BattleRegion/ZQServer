let handler = process.argv[2];
let event = process.argv[3];
let env = process.argv[4]?process.argv[4]:'dev';
console.log(`test:${handler} event:${event} env:${env}`);
let c = require(`./${handler}`);
let cobj = new c(env,()=>{
    cobj[event]();
});
