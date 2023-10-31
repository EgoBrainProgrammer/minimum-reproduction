import { IsNotEmpty, IsString } from 'class-validator';

export class RoleDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;
}