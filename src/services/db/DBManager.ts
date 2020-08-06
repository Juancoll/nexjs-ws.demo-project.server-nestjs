import { DBManagerBase, DBProviderBase, IAuthRepository } from '@/lib/db';

import { MainDB, EventsDB } from './db.providers';

export class DBManager extends DBManagerBase {

    //#region [ properties ]
    public get main(): MainDB { return this.get<MainDB>(this.authDBName); }
    public get events(): EventsDB { return this.get<EventsDB>('events'); }
    //#endregion

    constructor(private authDBName: string, authProvider: IAuthRepository & DBProviderBase<DBManager>) {
        super(authDBName, authProvider);
    }
}
