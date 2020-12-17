import { Logger, LoggerService, Injectable } from '@nestjs/common'
import { EmptyLogger } from './EmptyLogger'

@Injectable()
export abstract class Contract {
    //#region [ IName ]
    public readonly abstract service: string;
    //#endregion

    //#region  [ properties ]
    public logger: LoggerService;
    public set debug ( value: boolean ) {
        this.logger = this.debug
            ? new Logger( this.constructor.name )
            : this.logger = new EmptyLogger()
    }
    //#endregion

    //#region  [ constructor ]
    constructor () {
        this.debug = true
    }
    //#endregion
}

