import { Table, Column, DataType, BelongsTo, ForeignKey, HasMany } from 'sequelize-typescript';
import { BaseEntity } from '../../../core/entities/base.entity';
import { Nomination } from 'src/modules/nominations/entities/nomination.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Table
export class Candidate extends BaseEntity<Candidate> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    firstname: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    middlename: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    lastname: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    biography: string;

    @Column({
        type: DataType.STRING
    })
    photo: string;

    @ForeignKey(() => Nomination)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    nominationId: number;
    
    @BelongsTo(() => Nomination)
    nomination: Nomination;
}