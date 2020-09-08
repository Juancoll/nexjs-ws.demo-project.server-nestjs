import { Request } from 'express'

export class SessionTools {
    public static createSession ( req: Request, user: any ): Promise<Express.Session> {
        return new Promise<Express.Session>( ( resolve, reject ) => {
            req.logIn( user, err => {
                if ( err )
                    reject( err.message )
                else {
                    resolve( req.session )
                }
            } )
        } )
    }
    public static save ( session: Express.Session ): Promise<void> {
        return new Promise<void>( ( resolve, reject ) => {
            session.save( ( err ) => {
                if ( err ) reject( err )
                else resolve()
            } )
        } )
    }
    public static destroy ( session: Express.Session ): Promise<void> {
        return new Promise<void>( ( resolve, reject ) => {
            session.destroy( ( err ) => {
                if ( err ) reject( err )
                else resolve()
            } )
        } )
    }
    public static regenerate ( session: Express.Session ): Promise<void> {
        return new Promise<void>( ( resolve, reject ) => {
            session.regenerate( ( err ) => {
                if ( err ) reject( err )
                else resolve()
            } )
        } )
    }
    public static reload ( session: Express.Session ): Promise<void> {
        return new Promise<void>( ( resolve, reject ) => {
            session.reload( ( err ) => {
                if ( err ) reject( err )
                else resolve()
            } )
        } )
    }
}