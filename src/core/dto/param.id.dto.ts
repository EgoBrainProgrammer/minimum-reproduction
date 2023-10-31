import { Matches } from 'class-validator';

export class ParamIdDto {
    @Matches(/^[1-9][0-9]*$/, {
        message: "id param must be positive integer"
    })
    id: number;
}
