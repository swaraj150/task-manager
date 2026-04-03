import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsAlphanumeric()
    @MinLength(8)
    @MaxLength(16)
    password!: string;
}
