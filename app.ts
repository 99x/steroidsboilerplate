declare function require(module:string):any;

let core = require("steroidsruntime");
core.loadServerless();
core.start();