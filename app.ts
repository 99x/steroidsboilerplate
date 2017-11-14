import {TestExecutor} from "steroidslibrary/TestExecutor"
declare function require(module:string):any;
declare let __dirname:string;
declare let process:any;

if (process.argv[2] == "test"){
    TestExecutor.execute(__dirname);
}else{
    let core = require("steroidsruntime");
    core.loadServerless();
    core.start();
}