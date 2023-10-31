import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';

interface CreationAttrs {
    userId: number;
    isRevoked?: boolean;
    expires_in: number;
}

@Table
export class RefreshToken extends Model<RefreshToken, CreationAttrs> {    
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
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    isRevoked: boolean;

    @Column({
        type: DataType.BIGINT,
        allowNull: false
    })
    expires_in: number;
}