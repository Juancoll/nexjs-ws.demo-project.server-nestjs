import { Rest, Hub, HubEventSelectorData, HubEventSelector } from '@nexjs/wsserver'
import { Contract } from '@/lib/contracts'
import { DataType } from '@/models/types'

export class AuthContract extends Contract {
    public readonly service = 'authContract';

    @Hub( { isAuth: true } )
    onUpdate = new HubEventSelector<string, string>();

    @Hub( { isAuth: true } )
    onDataUpdate = new HubEventSelectorData<string, string, DataType>();

    @Rest( { isAuth: true } )
    print (): void {
        this.logger.log( 'print()' )
    }

    @Rest( { isAuth: true } )
    notify (): void {
        console.log( 'notify()' )
        this.onUpdate.emit( 'serverCredentials-001' )
        this.onDataUpdate.emit( 'serverCredentials-002', { a: 'hello', b: true } as DataType )
    }
}