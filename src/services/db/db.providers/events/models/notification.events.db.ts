import { Notification } from '@/models';
import { ModelProviderBase } from '@/lib/db';

import { DBManager } from '../../../DBManager';

export class NotificationEventsDB extends ModelProviderBase<DBManager, Notification> {

    //#region  [ abstract ]
    public collectionName = 'datas';
    public toModel(obj: Partial<Notification>): Notification { return new Notification(obj); }
    //#endregion

    constructor() {
        super();
    }
}
