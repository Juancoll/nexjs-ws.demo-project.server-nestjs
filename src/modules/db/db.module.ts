import { Module } from '@nestjs/common';
import { DBUserController } from './db.users.controller';
import { DBDataController } from './db.datas.controller';

@Module({
  controllers: [
    DBUserController,
    DBDataController],
})
export class DBModule { }
