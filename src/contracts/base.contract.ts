import { Rest, HubEvent, HubEventData, Hub, Data } from '../wslib'
import { AnyData } from '../models'
import { ContractBase } from '@/lib/contracts'

export class BaseContract extends ContractBase {
    public readonly service = 'baseContract';
    public readonly isAuth = false;
    public readonly roles = [];

    @Hub()
    onUpdate = new HubEvent();

    @Hub()
    onDataUpdate = new HubEventData<AnyData>();

    @Rest()
    print (): void {
        this.logger.log( 'print()' )
    }

    @Rest()
    delay ( @Data() value: number ): Promise<number>{
        this.logger.log( `delay(${value})` )
        return new Promise<number>( ( resolve ) => {
            setTimeout( () => {
                resolve( value )
                this.logger.log( 'delay(...) : send response' )
            }, value )
        } )
    }

    @Rest()
    notify (): void{
        this.logger.log( 'notify()' )
        this.onUpdate.emit()
        this.onDataUpdate.emit( { a: 'hello', b: true } as AnyData )
    }
}