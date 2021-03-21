import { Rest, Hub, HubEvent, HubEventData } from '../wslib'
import { ContractBase } from '../lib/contracts'
import { AnyData } from '@/models'

export class AuthContract extends ContractBase {
    public readonly service = 'authContract';
    public readonly isAuth = true;
    public readonly roles = ['admin']

    @Hub()
    onUpdate = new HubEvent();

    @Hub()
    onDataUpdate = new HubEventData<AnyData>();

    @Rest()
    print (): void {
        this.logger.log( 'print()' )
    }

    @Rest()
    notify (): void {
        this.logger.log( 'notify()' )
        this.onUpdate.emit()
        this.onDataUpdate.emit( { a: 'hola', b: true } as AnyData )
    }
}