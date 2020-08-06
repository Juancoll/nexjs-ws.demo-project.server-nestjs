import { Controller, Get, Logger } from '@nestjs/common';
import { db } from '@/services/db';
import { Data } from '@/models';
import { AComponent, BComponent } from '@/models/components';
import { ApiTags } from '@nestjs/swagger';

@Controller('db/datas')
@ApiTags('db/datas')
export class DBDataController {
    logger = new Logger('DBDataController');

    @Get('createData')
    async createData(): Promise<string> {

        this.logger.log('Create data object')
        const data = new Data({ value1: "hello", value2: 110 })
        this.logger.log('add Components')
        data.add(new AComponent("value A1", 110));
        data.add(new AComponent("value A2", 112));
        data.add(new BComponent("value B", 52));

        await db.main.datas.create(data);

        return 'data created'
    }

    @Get('updateData')
    async updateData(): Promise<string> {
        const data = await db.main.datas.findOne({});

        this.logger.log(`AComponent exists ${data.exists(AComponent) ? 'true' : 'false'}`);
        this.logger.log(`BComponent exists ${data.exists(BComponent) ? 'true' : 'false'}`);
        this.logger.log(`AComponent count ${data.count(AComponent)}`);
        this.logger.log(`BComponent count ${data.count(BComponent)}`);

        this.logger.log(`Update component Value`);
        data.first(BComponent).var1 = 'newValue B';
        await db.main.datas.updateModel(data);

        return 'data updated'
    }

    @Get('subscribeDataEvents')
    subscribeDataEvents(): string {
        db.main.datas.on();
        db.main.datas.onChange.sub(change => {
            this.logger.log(`DB Data Change`);
            console.log(change);
        });
        return 'subscribed';
    }

    @Get('unsubscribeDataEvents')
    unsubscribeDataEvents(): string {
        db.main.datas.off();
        db.main.datas.onChange.clear();
        return 'unsubscribed';
    }
}
