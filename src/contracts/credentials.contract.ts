import { Rest, Hub, HubEventCredentialsData, HubEventCredentials } from '@nexjs/wsserver'
import { DataType } from '@/models/types'
import { Contract } from '@/lib/contracts'

export class CredentialsContract extends Contract {
    public readonly name = 'credentialsContract';

    @Hub( {
        validation: async ( instance, user, credential ) => {
            this.logger.log( '[validation] onUpdate', credential )
            return true
        },
        selection: async ( instance, user, userCredentials, serverCredentials ) => {
            this.logger.log( '[selection] onUpdate', userCredentials, serverCredentials )
            return true
        },
    } )
    onUpdate = new HubEventCredentials<string>();

    @Hub( {
        validation: async ( instance, user, credential ) => {
            this.logger.log( '[validation] onDataUpdate', credential )
            return true
        },
        selection: async ( instance, user, userCredentials, serverCredentials ) => {
            this.logger.log( '[selection] onDataUpdate', userCredentials, serverCredentials )
            return true
        },
    } )
    onDataUpdate = new HubEventCredentialsData<string, DataType>();

    @Rest( {
        validation: async ( instance, user, credentials ) => {
            this.logger.log( '[validation] print()', credentials )
            return true
        },
    } )
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