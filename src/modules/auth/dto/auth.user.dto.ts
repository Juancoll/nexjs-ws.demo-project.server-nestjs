import { IAuthUser } from "@/lib/db/models";

export class AuthUserDto implements Partial<IAuthUser> {
    email: string;
    roles: string[];

    public constructor(init?: Partial<AuthUserDto>) {
        (<any>Object).assign(this, init);
    }
}