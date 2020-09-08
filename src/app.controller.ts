import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common'
import { AppService } from './app.service'
import { PackageJson, env } from './services/env'

@Controller()
export class AppController {
    constructor ( private readonly appService: AppService ) { }

    @Get()
    getHello (): string {
        return this.appService.getHello()
    }

    @Get( 'package' )
    getPackage (): PackageJson {
        try {
            return env.package
        } catch ( err ) {
            if ( err.getStatus ) {
                throw err
            }
            throw new HttpException( err.message, HttpStatus.NOT_ACCEPTABLE )
        }
    }
}
