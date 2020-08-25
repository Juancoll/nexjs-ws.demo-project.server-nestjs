import { Controller, Post, Body, UseGuards, Req, Logger } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth.login.dto';
import { ApiTags, ApiOkResponse, ApiBody, ApiBasicAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthLocalAuthenticatedGuard } from './guards';
import { Request } from 'express';
import { SessionTools } from './session/session.tools';
import { RequestUser } from './decorators/request.user.decorator';
import { AuthUserDto } from './dto/auth.user.dto';
import { AuthService } from './auth.service';
import { IAuthUser } from '@/lib/db/models';
import { AuthJwtLoginResponseDto } from './dto/auth.jwtLoginResponse.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    private logger = new Logger('http-auth-controller');
    constructor(
        private readonly authService: AuthService
    ) {
        this.logger.log(`constructor`)
    }
    @ApiOkResponse({ type: AuthUserDto })
    @Post('register')
    async register(
        @Body() dto: AuthLoginDto
    ): Promise<AuthUserDto> {
        try {
            this.logger.log(`register(...)`)
            const user = await this.authService.register(dto.email, dto.password);
            return new AuthUserDto(user);
        }
        catch (err) {
            throw err;
        }
    }

    @ApiOkResponse({ type: AuthUserDto })
    @UseGuards(AuthGuard('local'))
    @Post('localLogin')
    async localLogin(
        @Req() request: Request,
        @RequestUser() user: IAuthUser,
        @Body() dto: AuthLoginDto
    ): Promise<AuthUserDto> {
        try {
            this.logger.log(`localLogin(...)`)
            const user = await this.authService.localLogin(dto.email, dto.password);

            // create session
            this.logger.log(`localLogin: createSession`)
            const session = await SessionTools.createSession(request, user);
            this.logger.log(`localLogin: add session properties`)
            session.customSessionProp = "My Custom Session Property Value";

            return new AuthUserDto({ email: user.email, roles: user.roles });
        }
        catch (err) {
            throw err;
        }
    }

    @UseGuards(AuthLocalAuthenticatedGuard)
    @ApiBasicAuth()
    @Post('localLogout')
    async localLogout(
        @Req() request: Request,
        @RequestUser() user: IAuthUser
    ): Promise<void> {
        try {
            this.logger.log('localLogout()');
            await this.authService.localLogout(user);
            request.logout();
        }
        catch (err) {
            throw err;
        }
    }
    //#endregion

    //#region [ auth jwt strategy ]
    @ApiBody({ type: AuthLoginDto, required: true })
    @UseGuards(AuthGuard('local'))
    @Post('jwtLogin')
    async jwtLogin(
        @RequestUser() user: IAuthUser
    ): Promise<AuthJwtLoginResponseDto> {
        try {
            this.logger.log('jwtLogin(...)');
            const token = await this.authService.jwtLogin(user);
            return new AuthJwtLoginResponseDto({
                token: token,
                user: user,
            });
        }
        catch (err) {
            throw err;
        }
    }
}
