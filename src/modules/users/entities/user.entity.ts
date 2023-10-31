import { HasManyAddAssociationMixin, HasManyGetAssociationsMixin, BelongsToManyAddAssociationsMixin, 
    BelongsToManyRemoveAssociationsMixin, Association, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin } from 'sequelize';
import { Table, Column, Model, DataType, BelongsToMany, ForeignKey, BelongsTo, HasOne } from 'sequelize-typescript';
import { Department } from '../../departments/entities/department.entity';
import { Role } from '../../roles/entities/role.entity';
import { UserRole } from './userrole.entity';
import { EsaToken } from 'src/modules/auth/entities/esatoken.entity';

@Table
export class User extends Model<User> {
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    login: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: true,
    })
    email: string;

    @Column({
        type: DataType.STRING
    })
    password: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    lastname: string;

    @Column({
        type: DataType.STRING
    })
    patronymic: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    adauth: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    deleted: boolean;

    @BelongsToMany(() => Role, () => UserRole)
    roles: Array<Role & {UserRole: UserRole}>;

    @Column({
        type: DataType.BOOLEAN
    })
    sendonemail: boolean;

    @ForeignKey(() => Department)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    departmentId: number;
    
    @BelongsTo(() => Department)
    department: Department;

    @HasOne(() => EsaToken)
    esatoken: EsaToken;
    
    public setDepartment!: BelongsToSetAssociationMixin<Department, number>;
    public getDepartment!: BelongsToGetAssociationMixin<Department>;
    public getRoles!: HasManyGetAssociationsMixin<Role>;
    public addRole!: HasManyAddAssociationMixin<Role, number>;
    public setRoles!: BelongsToManyAddAssociationsMixin<Role, number>;
    public removeRoles!: BelongsToManyRemoveAssociationsMixin<Role, number>;
    public setEsaToken!: BelongsToSetAssociationMixin<EsaToken, number>;
    
    public static associations: {
        roles: Association<User, Role>;
        department: Association<User, Department>;
        esatoken: Association<User, EsaToken>;
    }
}