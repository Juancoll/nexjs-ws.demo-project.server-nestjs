import { Controller, Get, Logger, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { AuthLocalAuthenticatedGuard, RolesGuard } from '../auth/guards'
import { Roles } from '../auth/decorators'

@Controller( 'test' )
@ApiTags( 'test' )
export class TestController {
    logger = new Logger( 'TestController' );

    @Get( 'test-no-auth' )
    async testNoAuth (): Promise<string> {
        return 'ok'
    }

    @UseGuards( AuthLocalAuthenticatedGuard )
    @Get( 'test-auth-local' )
    async testAuthLocal (): Promise<string> {
        return 'ok'
    }

    @UseGuards( AuthLocalAuthenticatedGuard, RolesGuard )
    @Roles( 'user' )
    @Get( 'test-auth-local-with-role' )
    async testAuthLocalWithRole (): Promise<string> {
        return 'ok'
    }

    @UseGuards( AuthGuard( 'jwt' ) )
    @ApiBearerAuth()
    @Get( 'test-auth-jwt' )
    async testAuthJwt (): Promise<string> {
        return 'ok'
    }

    @UseGuards( AuthGuard( 'jwt' ), RolesGuard )
    @Roles( 'user' )
    @ApiBearerAuth()
    @Get( 'test-auth-jwt-with-role' )
    async testAuthJwtWithRole (): Promise<string> {
        return 'ok'
    }

    @UseGuards( AuthGuard( 'jwt' ), RolesGuard )
    @Roles( 'user' )
    @ApiBearerAuth()
    @Get( 'aaaa' )
    async aaa (): Promise<string> {
        return 'ok'
    }
}
