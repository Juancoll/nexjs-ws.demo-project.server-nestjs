import { AuthUserDto } from "./auth.user.dto";

export class AuthJwtLoginResponseDto {
    token: string;
    user: AuthUserDto

    public constructor(init?: Partial<AuthJwtLoginResponseDto>) {
        (<any>Object).assign(this, init);
    }
}