import { IAuthUser } from './models';

export interface IAuthRepository {
    createUser(email: string, encryptedPassword: string): Promise<IAuthUser>;
    getUserByEmail(email: string): Promise<IAuthUser | null>;
}
