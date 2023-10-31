import { Table, Column, DataType, ForeignKey, Index, BelongsTo } from 'sequelize-typescript';
import { BaseEntity } from '../../../core/entities/base.entity';
import { Nomination } from 'src/modules/nominations/entities/nomination.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Candidate } from 'src/modules/candidates/entities/candidate.entity';

@Table
export class Vote extends BaseEntity<Vote> {
    @ForeignKey(() => Nomination)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    @Index({ name: 'vote-unique-index', unique: true })
    nominationId: number;

    @BelongsTo(() => Nomination)
    nomination: Nomination;
    
    @ForeignKey(() => Candidate)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    @Index({ name: 'vote-unique-index', unique: true })
    candidateId: number;

    @BelongsTo(() => Candidate)
    candidate: Candidate;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    @Index({ name: 'vote-unique-index', unique: true })
    userId: number;

    @BelongsTo(() => User)
    user: User;
}