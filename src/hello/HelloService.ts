import {AbstractService} from "steroidslibrary/AbstractService"
import {Steroid} from "steroidslibrary/Steroids"

export class HelloService extends AbstractService {
    
    protected async onHandle(steroid: Steroid) {

        let name =steroid.request().pathParameters.name;
        
        return {message: "Hello : " + name};
    }

}