import { IAuthUser } from '@/lib/db/models';
import { ModelProviderBase } from '@/lib/db';
import { crypt } from '@/services/crypt';
import { User } from '@/models';

import { DBManager } from '../../../DBManager';

export class UserMainDB extends ModelProviderBase<DBManager, User> {

    //#region  [ abstract ]
    public collectionName = 'users';
    public toModel(obj: Partial<User>): User { return new User(obj); }
    //#endregion

    constructor() {
        super();
    }

    //#region  [ IAuthRepository ]
    async createMany(count: number, createAdmin: boolean): Promise<User[]> {
        const users: User[] = [];
        if (createAdmin) {
            console.log(`[UserDatabaseProvider] createMany: create admin user`);
            const admin = new User({
                email: `admin@nex-group.io`,
                password: crypt.encode('123456'),
                name: `admin`,
                surname: `any`,
                roles: ['admin', 'user'],
            });
            users.push(admin);
        }
        console.log(`[UserDatabaseProvider] registerMany: create ${count} more users`);
        for (let i = 0; i < count; i++) {
            const user = new User({
                email: `user${i}@nex-group.io`,
                password: crypt.encode('123456'),
                name: `user${i}`,
                surname: `surname${i}`,
                roles: ['user'],
            });
            users.push(user);
        }

        await this.collection.insertMany(users);

        return users;
    }
    async createUser(email: string, encryptedPassword: string): Promise<IAuthUser> {
        const existingUser = await this.getUserByEmail(email);
        if (existingUser) {
            throw new Error(`User ${existingUser.email} already exists`);
        }

        const user = new User({ email, password: encryptedPassword, roles: ['user'] });
        const response = await this.collection.insertOne(user);
        user._id = response.insertedId.toString();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user as any;
        return userWithoutPassword;
    }
    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.collection.findOne({ email });
        return user ? user : null;
    }
    //#endregion
}
