import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { crypt } from '@/services/crypt/';
import { db } from '@/services/db';
import { IAuthUser } from '@/lib/db/models';


@Injectable()
export class AuthService {

    private logger = new Logger('http-auth-service');

    constructor(
        private readonly jwtService: JwtService
    ) { }

    //#region  [ Controller ]
    async register(email: string, password: string): Promise<IAuthUser> {
        this.logger.log(`register( ${email}, ${password})`);
        if (!email) throw new Error(`email required`);
        if (!password) throw new Error(`password required`);

        const encryptedPassword = crypt.encode(password);
        const newUser = await db.createUser(email, encryptedPassword);
        return newUser;
    }
    jwtLogin(user: IAuthUser): Promise<string> {
        this.logger.log(`[AuthContract] jwtLogin ( ${user.email} )`);
        return this.createToken(user);
    }
    ////#endregion

    //#region  [ IAuthService ]
    async validateLocal(email: string, pass: string): Promise<IAuthUser> {
        this.logger.log(`[AuthService] validateLocal( ${email}, ${pass})`)
        const user = await db.getUserByEmail(email);
        if (user && crypt.compare(pass, user.password)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userWithoutPassword } = user; // remove password property (now we use an interceptor)
            return userWithoutPassword;
        }
        return null;
    }
    async validateJwt(payload: any): Promise<IAuthUser> {
        this.logger.log('[AuthService] validateJWT: payload', payload)
        return {
            email: payload.email,
            roles: payload.roles
        } as IAuthUser
    }
    async createToken(user: IAuthUser): Promise<string> {
        this.logger.log('[AuthService] createToken: user = ', user.email)
        return this.jwtService.sign({ email: user.email, roles: user.roles });
    }
    //#endregion
}
