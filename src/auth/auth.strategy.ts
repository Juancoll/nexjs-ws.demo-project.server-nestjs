import { SimpleEventDispatcher } from 'strongly-typed-events'
import { IAuthStrategy, ISocketClient, IAuthInfo } from '@nexjs/wsserver'
import { User, Token } from '@/models'
import { crypt } from '@/services/crypt'
import { jwt } from '@/services/jwt'
import { db } from '@/services/db'

interface IUserClients {
    user: User;
    clients: ISocketClient[];
}
interface IConnection {
    user: User;
    client: ISocketClient;
}

interface IConnectionEventArgs {
    conn: IConnection;
    sender: AuthStrategy;
}

export class AuthStrategy implements IAuthStrategy<User, Token> {
    //#region  [ field ]
    public users: IUserClients[] = [];
    public connections: IConnection[] = [];
    //#endregion

    //#region [ events ]
    public readonly onAdd = new SimpleEventDispatcher<IConnectionEventArgs>();
    public readonly onRemove = new SimpleEventDispatcher<IConnectionEventArgs>();
    //#endregion

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async register ( client: ISocketClient, data: any ): Promise<IAuthInfo<User, string>> {

        console.log( '[AuthStrategy] register' )

        const email = data.email
        const pass = data.password

        if ( !email ) { throw new Error( 'email required' ) }
        if ( !pass ) { throw new Error( 'password required' ) }

        let user: User = await db.getUserByEmail( email ) as User
        if ( user ) { throw new Error( 'user already exists' ) }

        const encryptedPassword = crypt.encode( pass )
        user = await db.createUser( email, encryptedPassword ) as User
        const token = jwt.sign( { email: user.email, roles: user.roles } )

        return this.add( client, user, token )
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async login ( client: ISocketClient, data: any ): Promise<IAuthInfo<User, string>> {

        console.log( '[AuthStrategy] login' )

        const email = data.email
        const pass = data.password

        const user: User = await db.getUserByEmail( email ) as User
        if ( !user ) { throw new Error( 'unauthorized' ) }

        if ( user && crypt.compare( pass, user.password ) ) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userWithoutPassword } = user // remove password property (now we use an interceptor)
            const token = jwt.sign( { email: user.email, roles: user.roles } )

            return this.add( client, userWithoutPassword as User, token )
        }

        throw new Error( 'user not found.' )
    }
    logout ( client: ISocketClient ): Promise<void> {

        console.log( '[AuthStrategy] logout' )
        this.remove( client )
        return
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async authenticate ( client: ISocketClient, data: any ): Promise<User> {

        console.log( '[AuthStrategy] authenticate' )
        const token = data
        const payload = jwt.verify<User>( token )
        if ( !payload.email || !payload.roles ) {
            throw new Error( 'invalid token' )
        }
        const user = {
            email: payload.email,
            roles: payload.roles,
        } as User
        this.add( client, user, token )
        return user
    }

    //#region [ private ]
    private add ( client: ISocketClient, user: User, token: string ): IAuthInfo<User, string> {

        this.connections.push( { user, client } )
        let found = this.users.find( x => x.user.email == user.email )
        if ( !found ) {
            found = { user, clients: [] }
            this.users.push( found )
        }
        found.clients.push( client )

        client.onDisconnect( () => {
            this.remove( client )
        } )
        this.onAdd.dispatch( { conn: { user, client }, sender: this } )
        return { user, token }
    }
    private remove ( client: ISocketClient ): void {
        const conn = this.connections.find( x => x.client.id == client.id )
        if ( conn ) {
            const item = this.users.find( x => x.user.email == conn.user.email )
            if ( item ) {
                item.clients = item.clients.filter( x => x.id != client.id )
                if ( item.clients.length == 0 ) {
                    this.users = this.users.filter( x => x.user.email != item.user.email )
                }
            }

            this.connections = this.connections.filter( x => x.client.id != client.id )
            this.onRemove.dispatch( { conn, sender: this } )
        }
    }
    //#endregion
}