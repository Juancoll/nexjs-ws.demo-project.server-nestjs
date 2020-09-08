import { ExecutionContext, Injectable, CanActivate, Logger } from '@nestjs/common'

@Injectable()
export class AuthLocalAuthenticatedGuard implements CanActivate {
    private logger = new Logger( 'auth-local-auth-guard' );
    canActivate ( context: ExecutionContext ): boolean {
        this.logger.log( '[AuthLocalAuthenticatedGuard] canActivate ' )
        const request = context.switchToHttp().getRequest()
        return request.isAuthenticated()
    }
}