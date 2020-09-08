import { IncludeModel } from '@nexjs/wsserver'
import { Model, IAuthUser } from '@/lib/db/models'

@IncludeModel
export class User extends Model implements IAuthUser {
    email: string;
    password?: string;
    roles: string[];
    name?: string;
    surname?: string;

    constructor ( init?: Partial<User> ) { super( init ) }
}
