import { Inject } from '@nestjs/common';
import { DEPARTMENT_REPOSITORY } from '../../core/constants';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create.department.dto';
import { UpdateDepartmentDto } from './dto/update.department.dto';
import { crudCreate, crudUpdate, findAllExt } from '../../core/utils/crud';
import { FindOptions } from 'sequelize';

export class DepartmentsService {
    constructor(@Inject(DEPARTMENT_REPOSITORY) private readonly departmentRepository: typeof Department) {}

    async create(request, departmentDto: CreateDepartmentDto): Promise<Department> {        
        return await crudCreate({
            request, 
            repository: this.departmentRepository, 
            findOptions: {
                where: {
                    name: departmentDto.name
                }                
            }, dto: departmentDto
        });
    }

    async bulkCreate(roles: CreateDepartmentDto[]): Promise<Department[]> {
        return await this.departmentRepository.bulkCreate(roles);
    }

    async findOneByName(name: string): Promise<Department> {
        return await this.departmentRepository.findOne<Department>({ where: { name }});
    }

    async findOneById(id: number): Promise<Department> {
        return await this.departmentRepository.findOne<Department>({ where: { id }});
    }

    async findAll(findOptions: FindOptions = {}, 
        queryFindOptions: string | object): Promise<Department[]> {
        return await findAllExt(this.departmentRepository, findOptions, queryFindOptions);
    }

    async update(request, id: number, departmentDto: UpdateDepartmentDto): Promise<{}> {
        return await crudUpdate(request, this.departmentRepository, id, 
            departmentDto, false);
    }

    async remove(id: number) {
        return await this.departmentRepository.destroy({
            where: { id }
        });
    }
}