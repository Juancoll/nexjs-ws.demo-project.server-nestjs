import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './session/session.serializer';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { env } from '@/services/env';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: env.vars.crypt.jwt_secret,
      signOptions: { expiresIn: env.vars.crypt.jwt_expiresIn },
    }),
  ],
  providers: [AuthService, LocalStrategy, SessionSerializer, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule { }
