import { Controller, Get, Logger, Query } from '@nestjs/common';
import { db } from '@/services/db';
import { User } from '@/models';
import { ApiTags } from '@nestjs/swagger';
import { crypt } from '@/services/crypt';

@Controller('db/users')
@ApiTags('db/users')
export class DBUserController {
    logger = new Logger('DBUserController');

    @Get('createUsers')
    async createUsers(
        @Query("email") email: string,
        @Query('password') password: string,
    ): Promise<User> {
        const user = await db.main.users.createUser(email, crypt.encode(password));
        return user as User;
    }
}
