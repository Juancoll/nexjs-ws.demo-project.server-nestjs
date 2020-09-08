import { IAuthUser } from '@/lib/db/models'
import { IAuthRepository, IDBCreationArgs, DBProviderBase } from '@/lib/db'

import { UserMainDB } from './models/user.main.db'
import { DBManager } from '../../DBManager'
import { DataMainDB } from './models/data.main.db'

export class MainDB extends DBProviderBase<DBManager> implements IAuthRepository {

    constructor ( dbCreationArgs?: IDBCreationArgs ) {
        super( dbCreationArgs )

        this.register( 'users', new UserMainDB() )
        this.register( 'datas', new DataMainDB() )
    }

    //#region [ IMainDBProvider ]
    public get users (): UserMainDB { return this.get<UserMainDB>( 'users' ) }
    public get datas (): DataMainDB { return this.get<DataMainDB>( 'datas' ) }
    //#endregion

    //#region  [ IAuthRepository ]
    createUser ( email: string, encryptedPassword: string ): Promise<IAuthUser> {
        return this.users.createUser( email, encryptedPassword )
    }
    getUserByEmail ( email: string ): Promise<IAuthUser | null> {
        return this.users.getUserByEmail( email )
    }
    //#endregion
}
