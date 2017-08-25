declare let module:any;
declare let __dirname:string;

import {Flask} from "steroidslibrary/Flask"
import {Steroid} from "steroidslibrary/Steroids"

module.exports = Steroid.initialize(__dirname,()=>{ });
