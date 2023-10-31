import { Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { Association, HasManyGetAssociationsMixin } from 'sequelize/types';
import { BaseEntity } from '../../../core/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Table
export class Department extends BaseEntity<Department> {
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    name: string;

    @HasMany(() => User)
    readonly users: User[];

    public getUsers!: HasManyGetAssociationsMixin<User>;

    public static associations: {
        createUser: Association<BaseEntity, User>;
        updateUser: Association<BaseEntity, User>;
        users: Association<Department, User>;
    };
}