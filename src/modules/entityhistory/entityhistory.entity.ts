import { Association } from 'sequelize';
import { Table, Column, Model, DataType, BelongsTo, ForeignKey, HasMany } from 'sequelize-typescript';
import { User } from '../users/entities/user.entity';
import { EntityEdit } from './entityedit.entity';

interface EntityHistoryCreationAttrs {
    entity: string;
    rowId: number;
    userId: number;
}

@Table
export class EntityHistory extends Model<EntityHistory, EntityHistoryCreationAttrs> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    entity: string;
    
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    rowId: number;
    
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number;
    
    @BelongsTo(() => User)
    user: User;

    @HasMany(() => EntityEdit)
    readonly edits: EntityEdit[];

    public static associations: {
        edits: Association<EntityHistory, EntityEdit>;
        user: Association<EntityHistory, User>;
    };
}