import { Model } from '@/lib/db/models';

export class Notification extends Model {
    type: string;
    message: string;

    constructor(init?: Partial<Notification>) { super(init); }
}
