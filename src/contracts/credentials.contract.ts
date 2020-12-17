import { Rest, Hub, HubEventSelectorData, HubEventSelector } from '@nexjs/wsserver'
import { DataType } from '@/models/types'
import { Contract } from '@/lib/contracts'

export class CredentialsContract extends Contract {
    public readonly service = 'credentialsContract';

    @Hub( {
        validate: async ( instance, user, validator ) => {
            instance.logger.log( '[validate] onUpdate', validator )
            return true
        },
        select: async ( instance, user, validator, selector ) => {
            instance.logger.log( '[select] onUpdate', validator, selector )
            return true
        },
    } )
    onUpdate = new HubEventSelector<string, string>();

    @Hub( {
        validate: async ( instance, user, validator ) => {
            instance.logger.log( '[validate] onDataUpdate', validator )
            return true
        },
        select: async ( instance, user, validator, selector ) => {
            instance.logger.log( '[select] onDataUpdate', validator, selector )
            return true
        },
    } )
    onDataUpdate = new HubEventSelectorData<string, string, DataType>();

    @Rest( )
    print (): void {
        this.logger.log( 'print()' )
    }

    @Rest()
    notify (): void {
        this.logger.log( 'notify()' )
        this.onUpdate.emit( 'serverCredentials-001' )
        this.onDataUpdate.emit( 'serverCredentials-002', { a: 'hello', b: true } as DataType )
    }
}