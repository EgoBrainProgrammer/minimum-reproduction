import { IsNotEmpty, IsString } from "class-validator";

export class CreateNominationDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}