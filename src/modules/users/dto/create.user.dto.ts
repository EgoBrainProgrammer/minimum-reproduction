import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, IsEmail, Allow, IsInt, Min, IsOptional, IsBoolean, ValidateIf } from 'class-validator';

import { IsStringOrNumArray } from '../../../core/decorators/validators/isstringornumarray.decorator';

export class CreateUserDto {
    @ApiProperty({ example: "login", description: "User login" })
    @IsNotEmpty()
    readonly login: string;

    @ApiProperty({ example: "strong_password_12345", description: "Input strong password" })
    @ValidateIf(value => !value.adauth)
    @IsNotEmpty()
    @MinLength(6)    
    readonly password: string;

    @ApiProperty({ example: "John", description: "User name" })
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ example: "Connor", description: "User lastname" })
    @IsNotEmpty()
    readonly lastname: string;
    
    @ApiProperty({ example: "Ivanovich", description: "User patronymic" })
    @IsOptional()
    readonly patronymic: string;

    @ApiProperty({ example: "123@123.ru", description: "Valid user e-mail" })
    @IsEmail()
    readonly email: string;

    @Min(1)
    @IsInt()
    @IsOptional()
    readonly departmentId?: number;
    
    @ApiProperty({ type: [String] || [Number], example: "['admin', 'purchase'] | [1,2,3,4]", description: "An array of valid id or valid names of roles" })
    @IsStringOrNumArray()
    @IsOptional()
    readonly roles?: string[] | number[];

    @IsBoolean()
    readonly adauth: boolean;
}