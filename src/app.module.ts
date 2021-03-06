import { join } from 'path'
import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DBModule } from './modules/db/db.module'
import { AuthModule } from './modules/auth/auth.module'
import { TestModule } from './modules/test/test.module'

@Module( {
    imports: [
        AuthModule,
        DBModule,
        TestModule,
        ServeStaticModule.forRoot( { rootPath: join( __dirname, '..', 'public' ) } ),
    ],
    controllers: [AppController],
    providers: [
        AppService,
    ],
} )
export class AppModule { }
