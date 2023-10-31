import { Association } from 'sequelize';
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { EntityHistory } from "./entityhistory.entity";

interface EntityEditCreationAttrs {
    entityHistoryId: number;
    fieldName: string;
    oldData: string;
    newData: string;
}

@Table
export class EntityEdit extends Model<EntityEdit, EntityEditCreationAttrs> {
    @ForeignKey(() => EntityHistory)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    entityHistoryId: number;
    
    @BelongsTo(() => EntityHistory)
    entityHistory: EntityHistory;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    fieldName: string;
    
    @Column({
        type: DataType.TEXT
    })
    oldData: string;

    @Column({
        type: DataType.TEXT
    })
    newData: string;

    public static associations: {
        entityHistory: Association<EntityEdit, EntityHistory>;
    };
}