import { User } from '@/models'

export class MeLocalAuthResponse {
    user: User;

    public constructor ( init?: Partial<MeLocalAuthResponse> ) { ( <any>Object ).assign( this, init ) }
}
