import { Exclude } from 'class-transformer';
import { Nomination } from '../entities/nomination.entity';

export class ResponseNominationDto {
    @Exclude()
    readonly createUserId: number;

    @Exclude()
    readonly updateUserId: number;

    constructor(partial: Partial<Nomination>) {
        Object.assign(this, partial);
    }
}