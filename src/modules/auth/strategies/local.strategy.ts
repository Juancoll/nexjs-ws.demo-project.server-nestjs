import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy( Strategy ) {
    private logger = new Logger( 'auth-local-strategy' )
    constructor ( private readonly authService: AuthService ) {
        super( {
            usernameField: 'email',
            passwordField: 'password',
        } )
        this.logger.log( '[LocalStrategy] constructor' )
    }

    async validate ( email: string, password: string ): Promise<any> {
        this.logger.log( `[LocalStrategy] validate(${email}, ${password})` )
        const user = await this.authService.validateLocal( email, password )
        if ( !user ) {
            throw new UnauthorizedException()
        }
        return user
    }
}

