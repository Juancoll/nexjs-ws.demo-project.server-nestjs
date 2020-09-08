import { Controller, Post, Get, Body, UseGuards, Req, Logger } from '@nestjs/common'
import { ApiTags, ApiBody, ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { AuthLocalAuthenticatedGuard } from './guards'
import { Request } from 'express'
import { SessionTools } from './session/session.tools'
import { RequestUser } from './decorators/request.user.decorator'
import { AuthService } from './auth.service'
import { IAuthUser } from '@/lib/db/models'
import { User } from '@/models'
import { RegisterAuthRequest, LoginLocalAuthRequest, LoginLocalAuthResponse, LoginJwtAuthRequest, LoginJwtAuthResponse } from './dto'
import { RegisterAuthResponse } from './dto/register.auth.response.dto'

@ApiTags( 'auth' )
@Controller( 'auth' )
export class AuthController {
    private logger = new Logger( 'http-auth-controller' );
    constructor (
        private readonly authService: AuthService
    ) {
        this.logger.log( 'constructor' )
    }

    @Post( 'register' )
    async register (
        @Body() dto: RegisterAuthRequest
    ): Promise<RegisterAuthResponse> {
        this.logger.log( 'register(...)' )
        const user = await this.authService.register( dto.email, dto.password )
        return new RegisterAuthResponse( { user: user as User } )
    }

    //#region [ auth local strategy ]
    @ApiBody( { type: LoginLocalAuthRequest, required: true } )
    @UseGuards( AuthGuard( 'local' ) )
    @Post( 'localLogin' )
    async localLogin (
        @Req() request: Request,
        @RequestUser() user: User,
    ): Promise<LoginLocalAuthResponse> {
        this.logger.log( 'localLogin(...)' )

        // create session
        this.logger.log( 'localLogin: createSession' )
        const session = await SessionTools.createSession( request, user )
        this.logger.log( 'localLogin: add session properties' )
        session.customSessionProp = 'My Custom Session Property Value'

        return new LoginLocalAuthResponse( { user } )
    }

    @UseGuards( AuthLocalAuthenticatedGuard )
    @ApiBasicAuth()
    @Post( 'localLogout' )
    async localLogout (
        @Req() request: Request
    ): Promise<void> {
        this.logger.log( 'localLogout()' )
        request.logout()
    }

    @UseGuards( AuthLocalAuthenticatedGuard )
    @ApiBasicAuth()
    @Get( 'localMe' )
    async localMe (
        @RequestUser() user: User
    ): Promise<{ user: IAuthUser }> {
        return { user }
    }
    //#endregion

    //#region [ auth jwt strategy ]
    @ApiBody( { type: LoginJwtAuthRequest, required: true } )
    @UseGuards( AuthGuard( 'local' ) )
    @Post( 'jwtLogin' )
    async jwtLogin (
        @RequestUser() user: User
    ): Promise<LoginJwtAuthResponse> {
        this.logger.log( 'jwtLogin(...)' )
        const token = await this.authService.jwtLogin( user )
        return new LoginJwtAuthResponse( {
            token: token,
            user: user,
        } )
    }

    @UseGuards( AuthGuard( 'jwt' ) )
    @ApiBearerAuth()
    @Get( 'jwtMe' )
    async jwtMe (
        @RequestUser() user: User
    ): Promise<{ user: IAuthUser }> {
        return { user }
    }
    //#endregion
}
