import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {

    private logger = new Logger( 'auth-local-role-guard' )

    constructor ( private readonly reflector: Reflector ) { }

    canActivate ( context: ExecutionContext ): boolean {
        this.logger.log( 'canActivate ' )
        const contextRoles = this.reflector.get<string[]>( 'roles', context.getHandler() )
        if ( !contextRoles ) {
            this.logger.log( 'canActivate: Controller Method has no roles decorator ' )
            return true
        }
        const request = context.switchToHttp().getRequest()
        this.logger.log( 'canActivate: request.user ', request.user )
        const user = request.user
        const hasRole = ( user: any ): boolean => {
            return user.roles.some( userRole => {
                return contextRoles.indexOf( userRole ) != -1
            } )
        }
        const canActivate = user && user.roles && hasRole( user )
        this.logger.log( `canActivate: ${canActivate}, controller roles: ${contextRoles}, user roles: ${user ? user.roles : 'user not found'} ` )
        return canActivate
    }
}
