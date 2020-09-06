import { User } from '@/models';


export class RegisterAuthResponse {
    user: User;

    public constructor(init?: Partial<RegisterAuthResponse>) { (<any>Object).assign(this, init); }
}
