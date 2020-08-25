import { ApiProperty } from '@nestjs/swagger';
import { MinLength, IsEmail, IsNotEmpty } from 'class-validator';


export class AuthLoginDto {
    @ApiProperty({ example: 'juan@nexjs.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456' })
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    public constructor(init?: Partial<AuthLoginDto>) { (<any>Object).assign(this, init); }
}
