import * as moment from 'moment'

import { Model } from '@/lib/db/models'

import { MongoDBConnection } from '../MongoDBConnection'
import { IModelProvider } from './IModelProvider'
import { DBManagerBase } from '../DBManagerBase'
import { ObjectId, ChangeStream, Collection, ChangeEvent } from 'mongodb'
import { SimpleEventDispatcher } from 'strongly-typed-events'

export abstract class ModelProviderBase<TManager extends DBManagerBase, TModel extends Model> implements IModelProvider<TModel> {

    //#region  [ abastract ]
    public abstract collectionName: string;
    public abstract toModel( obj: Partial<Model> ): TModel;

    //#region [ fieldcs ]
    private changeStream: ChangeStream<TModel>;

    //#region [ properties ]
    public _type: string;
    public conn: MongoDBConnection;
    public manager: TManager;
    //#endregion

    //#region [events]
    onChange = new SimpleEventDispatcher<ChangeEvent<TModel>>();
    //#endregion

    constructor () {
        this._type = this.constructor.name
    }

    //#region  [ IModelProvider ]
    public get collection (): Collection<TModel> {
        return this.conn.db.collection<TModel>( this.collectionName )
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public async getById ( id: any ): Promise<TModel> {
        const model = await this.collection.findOne( { _id: id } )
        return model
    }
    public async create ( model: TModel ): Promise<TModel> {
        model = this.setIdAsObjectId( model )
        model.createdAt = moment().valueOf()

        const res = await this.collection.insertOne( model as any )
        if ( res.insertedCount == 0 ) {
            throw new Error( 'error inserting model' )
        }
        return model
    }

    public async list (): Promise<TModel[]> {
        const res = this.collection.find()
        const result = await res.toArray()
        return result.map( x => this.toModel( x ) )
    }

    public async findById ( id: string ): Promise<TModel> {
        const model = await this.collection.findOne( { _id: new ObjectId( id ) as any } )
        if ( !model ) {
            throw new Error( 'model not found' )
        }
        return this.toModel( model )
    }
    public async findOne ( query: Partial<TModel> ): Promise<TModel> {
        query = this.setIdAsObjectId( query )

        const model = await this.collection.findOne( query )
        if ( !model ) {
            throw new Error( 'model not found' )
        }
        return this.toModel( model )
    }
    public async findMany ( query: Partial<TModel> ): Promise<TModel[]> {
        query = this.setIdAsObjectId( query )

        const res = this.collection.find( query )
        const result = await res.toArray()
        return result.map( x => this.toModel( x ) )
    }
    public async updateQuery ( filter: Partial<TModel>, query: Partial<TModel> ): Promise<number> {
        filter = this.setIdAsObjectId( filter )
        query = this.setIdAsObjectId( query )

        query.updatedAt = moment().valueOf()
        const update = { $set: query }

        const response = await this.collection.updateMany( filter, update, { upsert: false } )
        return response.matchedCount
    }
    public async updateModel ( model: TModel ): Promise<TModel> {
        try {
            if ( !model._id ) {
                throw new Error( '_id is undefined' )
            }
            model = this.setIdAsObjectId( model )
            model.updatedAt = moment().valueOf()

            const filter = {
                _id: model._id,
            }
            const response = await this.collection.findOneAndReplace( filter, model )
            if ( !response.ok ) {
                throw new Error( response.lastErrorObject )
            }
            model._id = model._id.toString()
            return model
        } catch ( err ) {
            model._id = model._id.toString()
            throw err
        }
    }

    public on (): void {
        if ( !this.changeStream ) {
            this.changeStream = this.collection.watch<TModel>()
            this.changeStream.on( 'change', change => this.onChange.dispatch( change ) )
        }
    }
    public off (): void {
        if ( this.changeStream ) {
            this.changeStream.removeAllListeners( 'change' )
            this.changeStream.close()
            this.changeStream = undefined
        }
    }
    //#endregion

    //#region [ private ]
    private setIdAsObjectId ( value: any ): any {
        if ( value._id && typeof value._id == 'string' ) {
            value._id = new ObjectId( value._id )
        }
        return value
    }
    //#endregion
}
