import { Collection, ChangeEvent } from 'mongodb'
import { SimpleEventDispatcher } from 'strongly-typed-events'

import { Model } from '@/lib/db/models'

export interface IModelProvider<TModel extends Model> {
    readonly collection: Collection<TModel>;

    onChange: SimpleEventDispatcher<ChangeEvent<TModel>>;

    insertModel( model: TModel ): Promise<TModel>;
    insertManyModels( models: TModel[] ): Promise<TModel[]>;
    list(): Promise<TModel[]>;

    findById( id: string ): Promise<TModel>;
    findOne( filter: any ): Promise<TModel>;
    findMany( filter: any ): Promise<TModel[]>;
    find( filter: any, sort?: any, limit?: number ): Promise<TModel[]>;

    updateModel( model: TModel ): Promise<TModel>;
    updateManyModels( models: TModel[] ): Promise<TModel[]>;
    updateOne( filter: any, query: any ): Promise<void>;
    updateMany( filter: any, query: any ): Promise<number>;

    removeModel( model: TModel ): Promise<void>;
    removeManyModels( models: TModel[] ): Promise<void>;
    removeById( id: string ): Promise<void>;
    removeOne( filter: any ): Promise<void>;
    removeMany( filter: any ): Promise<number>;

    on(): void;
    off(): void;
}
