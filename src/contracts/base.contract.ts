import { Rest, HubEvent, HubEventData, Hub, Data } from '@nexjs/wsserver'
import { Contract } from '@/lib/contracts';
import { DataType } from '@/models/types';

export class BaseContract extends Contract {
    public readonly name = 'baseContract';

    @Hub()
    onUpdate = new HubEvent();

    @Hub()
    onDataUpdate = new HubEventData<DataType>();

    @Rest()
    print(): void {
        this.logger.log("print()");
    }

    @Rest()
    delay(@Data() value: number): Promise<number> {
        this.logger.log(`delay(${value})`);
        return new Promise<number>((resolve) => {
            setTimeout(() => {
                resolve(value);
                this.logger.log(`delay(...) : send response`);
            }, value);
        });
    }

    @Rest()
    notify(): void {
        this.logger.log("notify()");
        this.onUpdate.emit();
        this.onDataUpdate.emit({ a: "hello", b: true } as DataType);
    }
}