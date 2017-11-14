import {IEvent} from "steroidslibrary/Messages"
import {Steroid} from "steroidslibrary/Steroids"
import {ServiceInvoker} from "steroidslibrary/ServiceInvoker"
import {Flask} from "steroidslibrary/Flask"
import {TestRunner, scenario, outcome, feature, jiraTask,asyncTest} from "steroidslibrary/TestRunner"

import {HelloService} from "./HelloService"

let assert = require("assert");
declare function require(module:string):any;
declare let console:any;

@feature("Hello World Service")
class HelloServiceTests extends Flask {

    @scenario("User invokes the hello world service with a valid name")
    @outcome("The service should return a valid JSON response")
    @asyncTest()
    public async scenario_1(given,when,then,and){

        let eventParams:IEvent = {
            headers:{},
            httpMethod:"GET", 
            pathParameters:{name:"Steroids Developer"},
            body:{},
            queryStringParameters:{}
        };
        

        let output = await ServiceInvoker.test(HelloService).withParameters(eventParams);
        
        assert.equal(output.success, true);
        assert.equal(output.response.message, "Hello : Steroids Developer");
    }
}

export let _handler = TestRunner.run(HelloServiceTests);