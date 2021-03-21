import { Contracts } from '@/contracts'
import { Logger, LoggerService } from '@nestjs/common'
import { EmptyLogger } from './EmptyLogger'

export abstract class ContractBase {
    //#region [ IName ]
    public readonly abstract service: string;
    public readonly abstract isAuth: boolean;
    public readonly abstract roles: string[];
    public contracts: Contracts
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

