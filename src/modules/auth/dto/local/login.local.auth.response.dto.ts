import { User } from '@/models'

export class LoginLocalAuthResponse {
    user: User;

    public constructor ( init?: Partial<LoginLocalAuthResponse> ) { ( <any>Object ).assign( this, init ) }
}
