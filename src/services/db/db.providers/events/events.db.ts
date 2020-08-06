import { DBProviderBase, IDBCreationArgs } from '@/lib/db';

import { DBManager } from '../../DBManager';
import { NotificationEventsDB } from './models/notification.events.db';

export class EventsDB extends DBProviderBase<DBManager>{
    constructor(dbCreationArgs: IDBCreationArgs) {
        super(dbCreationArgs);

        this.register('notifications', new NotificationEventsDB());
    }

    public get notifications(): NotificationEventsDB { return this.get<NotificationEventsDB>('notifications'); }
}
