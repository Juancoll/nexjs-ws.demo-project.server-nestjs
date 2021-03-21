import { DataSample } from '@/models'
import { ModelProviderBase } from '@/lib/db'

import { DBManager } from '../../../DBManager'

export class DataMainDB extends ModelProviderBase<DBManager, DataSample> {

    //#region  [ abstract ]
    public collectionName = 'data-samples';
    public toModel ( obj: Partial<DataSample> ): DataSample { return new DataSample( obj ) }
    //#endregion

    constructor () {
        super()
    }
}
