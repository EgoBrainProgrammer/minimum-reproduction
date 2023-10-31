import { Exclude } from 'class-transformer';

export class BaseResponseDto {
    @Exclude()
    readonly createdAt?: string;

    @Exclude()
    readonly updatedAt?: string;
}