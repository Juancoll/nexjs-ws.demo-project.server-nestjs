import { Rest, Context } from '../wslib'
import { ContractBase } from '../lib/contracts'
import { User } from '@/models'
import { db } from '@/services/db'

export class UsersContracts extends ContractBase {
    public readonly service = 'users';
    public readonly isAuth = true;
    public readonly roles = []

    @Rest()
    async me ( @Context( 'user' ) user: User ): Promise<User> {
        return await db.main.users.getUserByEmail( user._id )
    }
}