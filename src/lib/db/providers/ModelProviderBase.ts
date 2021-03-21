import * as moment from 'moment'
import { ObjectId, ChangeStream, Collection, ChangeEvent, Cursor } from 'mongodb'
import { SimpleEventDispatcher } from 'strongly-typed-events'

import { Model } from '@/lib/db/models'

import { MongoDBConnection } from '../MongoDBConnection'
import { IModelProvider } from './IModelProvider'
import { DBManagerBase } from '../DBManagerBase'

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
    public async insertModel ( model: TModel ): Promise<TModel> {
        model = this.setIdAsObjectId( model )
        model.createdAt = moment().valueOf()

        const res = await this.collection.insertOne( model as any )
        if ( res.insertedCount == 0 ) {
            throw new Error( 'error inserting model' )
        }
        return this.toModel( model )
    }
    public async insertManyModels ( models: TModel[] ): Promise<TModel[]> {
        models = models.map( x => this.setIdAsObjectId( x ) )
        models.forEach( x => x.createdAt = moment().valueOf() )

        const res = await this.collection.insertMany( models as any[] )
        if ( res.insertedCount != models.length ) {
            throw new Error( 'error inserting models' )
        }
        return models.map( x => this.toModel( x ) )
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
    public async findOne ( filter: any ): Promise<TModel|undefined> {
        filter = this.setIdAsObjectId( filter )

        const model = await this.collection.findOne( filter )
        return !model
            ? undefined
            : this.toModel( model )
    }
    public async findMany ( filter: any ): Promise<TModel[]> {
        filter = this.setIdAsObjectId( filter )

        const res = this.collection.find( filter )
        const result = await res.toArray()
        return result.map( x => this.toModel( x ) )
    }

    async find ( filter?: any, sort?: any, limit?: number ): Promise<TModel[]>{

        let res: Cursor<TModel> | undefined = undefined
        if ( !filter ) {
            res = this.collection.find()
        } else {
            filter = this.setIdAsObjectId( filter )
            if ( !sort ){
                res = this.collection.find( filter )
            } else {
                sort = this.setIdAsObjectId( sort )
                if ( !limit ){
                    res = this.collection.find( filter ).sort( sort )
                }else {
                    res = this.collection.find( filter ).sort( sort ).limit( limit )
                }
            }
        }
        const result = await res.toArray()
        return result.map( x => this.toModel( x ) )
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
    public async updateManyModels ( models: TModel[] ): Promise<TModel[]> {
        models = models.map( x => this.setIdAsObjectId( x ) )
        const updates = []
        models.forEach( model => {
            updates.push( { replaceOne: {
                filter: { _id: model._id },
                replacement: model,
            } } )
        } )
        const res = await this.collection.bulkWrite( updates )
        if ( res.matchedCount != models.length ){
            throw new Error( 'Updated counts error.' )
        }
        return models.map( x => this.toModel( x ) )
    }
    public async updateOne ( filter: any, query: any ): Promise<void> {
        filter = this.setIdAsObjectId( filter )
        query = this.setIdAsObjectId( query )

        await this.collection.updateOne( filter, query, { upsert: false } )
        await this.collection.updateOne( filter, { $set: { updatedAt: moment().valueOf() } } as any, { upsert: false } )
    }
    public async updateMany ( filter: any, query: any ): Promise<number> {
        filter = this.setIdAsObjectId( filter )
        query = this.setIdAsObjectId( query )

        const result = await this.collection.updateMany( filter, query, { upsert: false } )
        await this.collection.updateMany( filter, { $set: { updatedAt: moment().valueOf() } } as any, { upsert: false } )

        return result.matchedCount
    }

    public async removeModel ( model: TModel ): Promise<void>{
        return await this.removeById( model._id )
    }
    public async removeManyModels ( models: TModel[] ): Promise<void>{
        const ids = models.map( x => new ObjectId( x._id ) )
        const filter = { _id: { $in: ids } } as any

        const res = await this.collection.deleteMany( filter )
        if ( res.deletedCount != models.length ){
            throw new Error( 'Removed counts error.' )
        }
    }
    public async removeById ( id: string ): Promise<void> {

        const result = await this.collection.deleteOne( { _id: new ObjectId( id ) as any } )
        if ( result.deletedCount == 0 ) {
            throw new Error( 'model not found' )
        }
    }
    public async removeOne ( filter: any ): Promise<void> {
        filter = this.setIdAsObjectId( filter )
        const result = await this.collection.deleteOne( filter )
        if ( result.deletedCount == 0 ) {
            throw new Error( 'model not found' )
        }
    }
    public async removeMany ( filter: any ): Promise<number> {
        filter = this.setIdAsObjectId( filter )
        const result = await this.collection.deleteMany( filter )
        return result.deletedCount
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
        if ( value._id && value._id.$in && Array.isArray( value._id.$in ) ) {
            value._id.$in = value._id.$in.map( x => {
                if ( typeof x == 'string' ){
                    return new ObjectId( x )
                } else if ( this.isObjectId( x ) ) {
                    return x
                } else throw new Error( 'bad _id type' )
            } )
        }
        return value
    }
    isObjectId ( value: any ): boolean{
        if ( typeof value == 'object' ) {
            if ( Object.getPrototypeOf( value ) == ObjectId.prototype ) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    //#endregion
}
