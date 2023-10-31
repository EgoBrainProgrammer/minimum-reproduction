import { Exclude } from 'class-transformer';
import { User } from '../entities/user.entity';

export class ResponseUserDto {
    @Exclude()
    readonly password: string;

    @Exclude()
    readonly esatoken: object;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}