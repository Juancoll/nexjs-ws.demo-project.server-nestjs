import { Injectable, Logger } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { WSServer, SocketIOServer } from '@nexjs/wsserver';
import { User, Token } from '@/models';
import { AuthContract, BaseContract, CredentialsContract } from './contracts';
import { AuthStrategy } from './auth';



@WebSocketGateway({
    path: '/wsapi',
    namespace: '/',
})
@Injectable()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    //#region [ properties ]
    @WebSocketServer() public server: Server;
    public logger = new Logger('AppGateway');
    public wss: WSServer<User, string>;
    //#endregion

    constructor(
        private readonly authContract: AuthContract,
        private readonly baseContract: BaseContract,
        private readonly credentialsContract: CredentialsContract,
    ) {
        this.wss = new WSServer<User, Token>(new AuthStrategy());

        this.wss.auth.isLoginRequired = true;
        this.wss.auth.loginRequiredTimeout = 5000;

        this.registerDebugEvents();
        this.wss.register(this.authContract);
        this.wss.register(this.baseContract);
        this.wss.register(this.credentialsContract);
    }

    //#region  [ gateway interfaces ]
    afterInit(server: Server): void {
        this.logger.log('initialized');
        this.wss.init(new SocketIOServer(server));
    }
    handleConnection(client: SocketIO.Socket): void {
        this.logger.log(`[nest/ws] connected id:    ${client.id}, #clients: ${Object.keys(this.server.sockets).length}`);
    }
    handleDisconnect(client: SocketIO.Socket): void {
        this.logger.log(`[nest/ws] disconnected id: ${client.id}, #clients: ${Object.keys(this.server.sockets).length}`);
    }
    //#endregion

    //#region [ private ]
    private registerDebugEvents(): void {

        //#region [ auth strategy events]
        const strategy = this.wss.auth.strategy as AuthStrategy;
        strategy.onAdd.sub(e => this.logger.log(`[wss/auth/strategy] on Add(${e.conn.user.email}), #conn: ${e.sender.connections.length}, #users: ${e.sender.users.length}`));
        strategy.onRemove.sub(e => this.logger.log(`[wss/auth/strategy] on Remove(${e.conn.user.email}), #conn: ${e.sender.connections.length}, #users: ${e.sender.users.length}`));

        //#endregion

        //#region [ auth event ]
        this.wss.auth.onTimeout.sub(e => this.logger.log(`[wss/auth] onTimeout client.id: ${e.id}: login or authenticate required in ${this.wss.auth.loginRequiredTimeout} millis.`));
        this.wss.auth.onAuthenticate.sub(e => this.logger.log(`[wss/auth] onAuthenticate client.id: ${e.client.id}, authInfo:{  user: ${e.authInfo.user.email}, token:..., }`));
        this.wss.auth.onLogin.sub(e => this.logger.log(`[wss/auth] onLogin client.id: ${e.client.id}, authInfo:{  user: ${e.authInfo.user.email}, token:..., }`));
        this.wss.auth.onLogout.sub(e => this.logger.log(`[wss/auth] onLogout client.id: ${e.client.id},authInfo:{  user: ${e.authInfo.user.email}, token:..., }`));
        this.wss.auth.onRegister.sub(e => this.logger.log(`[wss/auth] onRegister client.id: ${e.client.id}, authInfo:{  user: ${e.authInfo.user.email}, token:..., }`));
        //#endregion

        //#region [ hub events]
        this.wss.hub.onRegister.sub(e => this.logger.log(`[wss/hub] onRegister service: ${e.service}, event: ${e.event}, isAuth: ${e.options.isAuth}, roles: ${e.options.roles}`));
        this.wss.hub.onPublish.sub(e => this.logger.log(`[wss/hub] onPublish  service: ${e.descriptor.service}, event: ${e.descriptor.event}, clients: ${e.clients.map(x => x.id).join(',')}`));
        this.wss.hub.onSuscribed.sub(e => this.logger.log(`[wss/hub]${e.error ? '[error]' : ''} onSuscribed service: ${e.service}, event: ${e.event}, client: ${e.client.id}`));
        this.wss.hub.onUnsuscribed.sub(e => this.logger.log(`[wss/hub]${e.error ? '[error]' : ''} onUnsuscribed service: ${e.service}, event: ${e.event}, client: ${e.client.id}`));
        //#endregion

        //#region  [ rest events ]
        this.wss.rest.onRegister.sub(e => this.logger.log(`[wss/rest] onRegister service: ${e.service}, method: ${e.method}, isAuth: ${e.options.isAuth}, roles: ${e.options.roles}`));
        this.wss.rest.onRequest.sub(e => this.logger.log(`[wss/rest]${e.error ? '[error]' : ''} onRequest service: ${e.service}, method: ${e.method}, client: ${e.client.id}${e.error ? ', error: ' + e.error.message : ''}`));
        //#endregion
    }
    //#endregion
}
