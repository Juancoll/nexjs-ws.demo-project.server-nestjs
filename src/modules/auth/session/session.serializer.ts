import { PassportSerializer } from '@nestjs/passport'
import { Injectable, Logger } from '@nestjs/common'
@Injectable()
export class SessionSerializer extends PassportSerializer {
  private logger = new Logger( 'auth-session-serializer' );
  serializeUser ( user: any, done: ( err: Error, user: any )=> void ): any {
      this.logger.log( `serializeUser ( ${user.email})` )
      done( null, user )
  }
  deserializeUser ( payload: any, done: ( err: Error, payload: string )=> void ): any {
      this.logger.log( `deserializeUser ( ${payload.email})` )
      done( null, payload )
  }
}