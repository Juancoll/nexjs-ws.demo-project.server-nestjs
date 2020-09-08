
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, Logger } from '@nestjs/common'
import { AuthService } from '../auth.service'
import { IAuthUser } from '@/lib/db/models'

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {
    private logger = new Logger( 'auth-jwt-strategy' )
    constructor ( private readonly authService: AuthService ) {
        super( {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        } )
        this.logger.log( 'construtor' )
    }

    async validate ( payload: any ): Promise<IAuthUser> {
        this.logger.log( `validate(${payload})` )
        return this.authService.validateJwt( payload )
    }
}