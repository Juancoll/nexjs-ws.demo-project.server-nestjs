import { Model } from '@/lib/db/models'

export class DataSample extends Model{
    value1: string;
    value2: number;

    constructor ( init?: Partial<DataSample> ) { super( init ) }
}