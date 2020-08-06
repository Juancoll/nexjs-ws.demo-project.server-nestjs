import { Model } from '@/lib/db/models';

export class Data extends Model {
    value1: string;
    value2: number;

    constructor(init?: Partial<Data>) { super(init); }
}
