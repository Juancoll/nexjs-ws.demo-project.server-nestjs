import { Logger } from '@nestjs/common'
import { WSServer } from './wslib'
import * as io from 'socket.io'
import { AuthStrategy } from './auth'
import { ContractBase } from './lib/contracts'
import { Token, User } from './models'
import { SocketIOServer } from '@nexjs/wsserver'

export class WSAppServer {
    logger = new Logger( 'WSAppServer' )
    ioServer: io.Server
    wss: WSServer<User, string>;

    setup ( httpServer: any, requireLogin: boolean, timeout: number ): void {
        this.logger.log( 'setup' )

        this.ioServer = new io.Server( httpServer, {
            path: '/wsapi',
            cors: { origin: '*' },
        } )

        this.ioServer.on( 'connection', socket => {
            this.logger.log( `add ws connection: ${socket.id}` )
            socket.on( 'disconnect', msg => {
                this.logger.log( `remove ws connection: ${socket.id}, msg: ${msg}` )
            } )
        } )

        this.logger.log( 'create nexjs websocket server' )
        this.wss = new WSServer<User, Token>( new AuthStrategy() )
        this.wss.auth.isLoginRequired = requireLogin
        this.wss.auth.loginRequiredTimeout = timeout
        this.logger.log( `set auth to isLoginRequired: ${this.wss.auth.isLoginRequired}, loginRequiredTimeout:${this.wss.auth.loginRequiredTimeout}` )

        this.logger.log( 'bind wsserver to socket ioserver' )
        this.wss.init( new SocketIOServer( this.ioServer ) )
    }

    register ( contracts: ContractBase[] ): void {
        this.logger.log( 'register' )
        contracts.forEach( x => {
            this.logger.log( `register contract ${x.service}` )
            try{
                this.wss.register( x )
            }catch( err ){
                this.logger.error( err.message )
            }
        } )
    }

    debubWSServer (): void {
        this.logger.log( 'registerDebugEvents' )
        //#region [ auth strategy events]
        const strategy = this.wss.auth.strategy as AuthStrategy
        strategy.onAdd.sub( e => this.logger.log( `[wss/auth/strategy] on Add(${e.conn.user.email}), #conn: ${e.sender.connections.length}, #users: ${e.sender.users.length}` ) )
        strategy.onRemove.sub( e => this.logger.log( `[wss/auth/strategy] on Remove(${e.conn.user.email}), #conn: ${e.sender.connections.length}, #users: ${e.sender.users.length}` ) )

        //#endregion

        //#region [ auth event ]
        this.wss.auth.onTimeout.sub( e => this.logger.warn( `[wss/auth] onTimeout client.id: ${e.id}: login or authenticate required in ${this.wss.auth.loginRequiredTimeout} millis.` ) )
        this.wss.auth.onAuthenticate.sub( e => this.logger.log( `[wss/auth] onAuthenticate client.id: ${e.client.id}, authInfo:{  user: ${e.authInfo.user.email}, token:..., }` ) )
        this.wss.auth.onLogin.sub( e => this.logger.log( `[wss/auth] onLogin client.id: ${e.client.id}, authInfo:{  user: ${e.authInfo.user.email}, token:..., }` ) )
        this.wss.auth.onLogout.sub( e => this.logger.log( `[wss/auth] onLogout client.id: ${e.client.id},authInfo:{  user: ${e.authInfo.user.email}, token:..., }` ) )
        this.wss.auth.onRegister.sub( e => this.logger.log( `[wss/auth] onRegister client.id: ${e.client.id}, authInfo:{  user: ${e.authInfo.user.email}, token:..., }` ) )
        //#endregion

        //#region [ hub events]
        this.wss.hub.onRegister.sub( e => this.logger.log( `[wss/hub] onRegister service: ${e.service}, event: ${e.event}, isAuth: ${e.options.isAuth}, roles: ${e.options.roles}` ) )
        this.wss.hub.onPublish.sub( e => this.logger.log( `[wss/hub] onPublish  service: ${e.descriptor.service}, event: ${e.descriptor.event}, clients: ${e.clients.map( x => x.id ).join( ',' )}, data: ${e.data ? JSON.stringify( e.data ): '' }` ) )
        this.wss.hub.onSuscribed.sub( e => {
            if ( e.error ){
                this.logger.error( `[wss/hub][error] onSuscribed service: ${e.service}, event: ${e.event}, client: ${e.client.id}, error: ${JSON.stringify( e.error )}` )
            } else {
                this.logger.log( `[wss/hub] onSuscribed service: ${e.service}, event: ${e.event}, client: ${e.client.id}` )
            }
        } )
        this.wss.hub.onUnsuscribed.sub( e => {
            if ( e.error ){
                this.logger.error( `[wss/hub][error] onUnsuscribed service: ${e.service}, event: ${e.event}, client: ${e.client.id}, error: ${JSON.stringify( e.error )}` )
            } else {
                this.logger.log( `[wss/hub] onUnsuscribed service: ${e.service}, event: ${e.event}, client: ${e.client.id}` )
            }
        } )
        //#endregion

        //#region  [ rest events ]
        this.wss.rest.onRegister.sub( e => this.logger.log( `[wss/rest] onRegister service: ${e.service}, method: ${e.method}, isAuth: ${e.options.isAuth}, roles: ${e.options.roles}` ) )
        this.wss.rest.onRequest.sub( e => {
            if ( e.error ){
                this.logger.error( `[wss/hub][error] onRequest service: ${e.service}, method: ${e.method}, client: ${e.client.id}, error: ${JSON.stringify( e.error )}` )
            } else {
                this.logger.log( `[wss/hub] onRequest: ${e.service}, method: ${e.method}, client: ${e.client.id}` )
            }
        } )
        //#endregion
    }
    debugEngineIOServer (): void {
        // [ debug underlying engineIO protocol ]
        ( this.ioServer as any ).engine.on( 'connection', ( socket: any ) => {
            this.logger.log( '[engine.io][connection]' )

            // socket.on('message', (data: any) => console.log('[engine.io][message]', JSON.stringify(data)));
            socket.on( 'close', ( data: any ) => this.logger.log( `[engine.io][close] ${JSON.stringify( data )}` ) )
            socket.on( 'error', ( data: any ) => this.logger.log( `[engine.io][error] ${JSON.stringify( data )}` ) )
            socket.on( 'flush', ( data: any ) => this.logger.log( `[engine.io][flush] ${JSON.stringify( data )}` ) )
            socket.on( 'drain', ( data: any ) => this.logger.log( `[engine.io][drain] ${JSON.stringify( data )}` ) )
            socket.on( 'packet', ( data: any ) => this.logger.log( `[engine.io][packet] ${JSON.stringify( data )}` ) )
            socket.on( 'packetCreate', ( data: any ) => this.logger.log( `[engine.io][packetCreate] ${ JSON.stringify( data )}` ) )
        } )
    }
}

const ioserver = new WSAppServer
export default ioserver