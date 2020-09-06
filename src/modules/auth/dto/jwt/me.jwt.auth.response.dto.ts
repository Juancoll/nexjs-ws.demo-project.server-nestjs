import { User } from '@/models';


export class MeJwtAuthResponse {
    user: User;

    public constructor(init?: Partial<MeJwtAuthResponse>) { (<any>Object).assign(this, init); }
}
