import { Logger } from '@nestjs/common'

import { env } from '../env'

import { DBManager } from './DBManager'
import { MainDB, EventsDB } from './db.providers'

const logger = new Logger( 'service db' )
export let db: DBManager
export const initialize = (): void => {

    logger.log( `set main as ${env.vars.db.main.connectionString}` )
    db = new DBManager( 'main', new MainDB( {
        connectionString: env.vars.db.main.connectionString,
        dbName: env.vars.db.main.name,
    } ) )

    logger.log( `set events as ${env.vars.db.events.connectionString}` )
    db.register( 'events', new EventsDB( {
        connectionString: env.vars.db.events.connectionString,
        dbName: env.vars.db.events.name,
    } ) )

    db.onConnected.sub( provider => logger.log( `[${provider._type}] onConnected` ) )
    db.onReconnected.sub( provider => logger.log( `[${provider._type}] onReconnected` ) )
    db.onDisconnected.sub( provider => logger.log( `[${provider._type}] onDisconnected` ) )
    db.onHostsChange.sub( provider => logger.log( `[${provider._type}] onHostsChange` ) )
    db.onError.sub( ( provider, err ) => logger.error( `[${provider._type}] onError: ${err.message}` ) )
    db.onReconnecting.sub( ( provider ) => logger.log( `[${provider._type}] onReconnecting` ) )
}

export * from './DBManager'
export * from './db.providers'
