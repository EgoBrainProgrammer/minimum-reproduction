import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';

@Table
export class EsaToken extends Model<EsaToken> {    
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        unique: true,
    })
    userId: number;
    
    @BelongsTo(() => User)
    user: User;

    @Column({
        type: DataType.TEXT
    })
    access_token: string;

    @Column({
        type: DataType.TEXT
    })
    refresh_token: string;
}