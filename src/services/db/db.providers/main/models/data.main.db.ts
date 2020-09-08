import { Data } from '@/models'
import { ModelProviderBase } from '@/lib/db'

import { DBManager } from '../../../DBManager'

export class DataMainDB extends ModelProviderBase<DBManager, Data> {

    //#region  [ abstract ]
    public collectionName = 'datas';
    public toModel ( obj: Partial<Data> ): Data { return new Data( obj ) }
    //#endregion

    constructor () {
        super()
    }
}
