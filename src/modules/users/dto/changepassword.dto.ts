import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @IsNotEmpty()
    readonly oldPassword: string;

    @IsNotEmpty()
    @MinLength(6)
    readonly newPassword: string;
}