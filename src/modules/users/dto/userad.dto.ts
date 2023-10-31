import { IsNotEmpty, MinLength } from 'class-validator';

export class UserAdDto {
    @IsNotEmpty()
    readonly username: string;

    @IsNotEmpty()
    @MinLength(6)
    readonly password: string;
}