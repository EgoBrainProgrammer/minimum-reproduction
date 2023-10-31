import { Inject, Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { ROLE_REPOSITORY, SEQUELIZE } from '../../core/constants';
import { Sequelize } from 'sequelize-typescript';
import { FindOptions, Op } from 'sequelize';
import { RoleDto } from './dto/role.dto';

@Injectable()
export class RolesService {
    constructor(@Inject(ROLE_REPOSITORY) private readonly roleRepository: typeof Role,
        @Inject(SEQUELIZE) private readonly connection: Sequelize) {}

    async create(role: RoleDto): Promise<Role> {
        return await this.roleRepository.create<Role>(role);
    }

    async bulkCreate(roles: RoleDto[]): Promise<Role[]> {
        return await this.roleRepository.bulkCreate(roles);
    }

    async findOneByName(name: string, include: any[] = []): Promise<Role> {
        return await this.roleRepository.findOne<Role>({
            where: { name },
            include
        });
    }

    async findAll(options: FindOptions = {}): Promise<Role[]> {
        return await this.roleRepository.findAll<Role>(options);
    }

    async findSome(roles: string[] | number[]): Promise<Role[]> {
        let result = [];
        if(roles.length > 0) {
            let where;
            if(Number.isInteger(roles[0]))
                where = { id: { [Op.in]: roles } };
            else
                where = { name: { [Op.in]: roles } };

            result = await this.roleRepository.findAll<Role>({
                    where
                });
        }

        return result;
    }

    async findOne(id: number): Promise<Role> {
        return await this.roleRepository.findOne<Role>({
            where: { id }
        });
    }

    async delete(id) {        
        return await this.roleRepository.destroy({ where: { id } });
    }

    async update(id, data) {
        const [numberOfAffectedRows, [updatedRole]] = await this.roleRepository.update({ ...data }, { where: { id }, returning: true });
        return { numberOfAffectedRows, updatedRole };
    }
}
