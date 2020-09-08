import { User } from '@/models'

export class LoginJwtAuthResponse {
    user: User;
    token: string;

    public constructor ( init?: Partial<LoginJwtAuthResponse> ) { ( <any>Object ).assign( this, init ) }
}
