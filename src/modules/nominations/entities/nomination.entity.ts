import { Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { Association } from 'sequelize/types';
import { BaseEntity } from '../../../core/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Candidate } from 'src/modules/candidates/entities/candidate.entity';

@Table
export class Nomination extends BaseEntity<Nomination> {
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    name: string;

    @HasMany(() => Candidate)
    readonly candidates: Candidate[];

    public static associations: {
        createUser: Association<BaseEntity, User>;
        updateUser: Association<BaseEntity, User>;
        candidates: Association<Candidate, User>;
    };
}