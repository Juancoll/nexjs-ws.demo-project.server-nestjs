import { ApiProperty } from '@nestjs/swagger';
import { MinLength, IsEmail, IsNotEmpty } from 'class-validator';


export class LoginJwtAuthRequest {
    @ApiProperty({ example: 'juan@any.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456' })
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    public constructor(init?: Partial<LoginJwtAuthRequest>) { (<any>Object).assign(this, init); }
}
