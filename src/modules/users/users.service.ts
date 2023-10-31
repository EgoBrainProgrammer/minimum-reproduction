import { Injectable, Inject, NotFoundException, forwardRef } from '@nestjs/common';
import { User } from './entities/user.entity';
import { USER_REPOSITORY } from '../../core/constants';
import { FindOptions, Op } from 'sequelize';
import { UpdateUserDto } from './dto/update.user.dto';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create.user.dto';
import { AuthService } from '../auth/auth.service';
import { DepartmentsService } from '../departments/departments.service';

@Injectable()
export class UsersService {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
        private rolesService: RolesService,
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService,
        private departmentsService: DepartmentsService,) {}

    async normalize(user: User, flatRoles = true): Promise<{}> {
        let password;
        const usr = { password, ...user.toJSON() };

        return {
            ...usr,
            roles: flatRoles ? (await user.getRoles()).map(role => role.name) : 
                await (await user.getRoles()).map(role => ({ id: role.id, name: role.name, title: role.title }))
        };
    }

    async create(userDto: CreateUserDto): Promise<User> {
        const {roles, ...userParams} = userDto;
        if(userParams.hasOwnProperty("password") && userParams.password)
            userParams.password = await this.authService.hashPassword(userParams.password);        

        const user = new User(userParams);
        await user.save();

        if(Array.isArray(roles) && roles.length > 0)
            await user.setRoles(await this.rolesService.findSome(userDto.roles));

        return user;
    }

    async findOneByName(name: string): Promise<User> {
        let user = null;
        if(name)
            user = await this.userRepository.findOne<User>({ where: { name, deleted: false }, attributes: { exclude: ['password'] } });
        return user;
    }

    async findOneByLogin(login: string, excludes?: string[]): Promise<User> {
        let user = null;
        if(login)
            user = await this.userRepository.findOne<User>({
                where: { login },
                attributes: {
                    exclude: excludes
                },
                include: [
                    User.associations.roles,
                    User.associations.department,
                    User.associations.esatoken
                ]
            });
        return user;
    }

    async findOneByEmail(email: string, excludes?: string[]): Promise<User> {
        let user = null;
        if(email)
            user = await this.userRepository.findOne<User>({ 
                where: { email, deleted: false }, 
                attributes: { exclude: excludes }
            });
        return user;
    }

    async findOneById(id: number, excludes?: string[]): Promise<User> {
        return await this.userRepository.findOne<User>({ 
            where: { id },
            attributes: { exclude: excludes },
            include: [
                User.associations.roles,
                User.associations.department,
                User.associations.esatoken
            ]
        });
    }

    async getPassword(data: string): Promise<string> {
        const user = await this.userRepository.findOne<User>({ where: { 
            [Op.or]: [
                { login: data },
                { email: data }
            ]
        }});
        return user.password;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        let user = await this.userRepository.findOne({
            where: { id },
            attributes: { exclude: ['password'] },
        });        

        if(!user)
            throw new NotFoundException('This user doesn\'t exist');

        let roles;        
        const updateUserParams = { roles, ...updateUserDto};
        if(updateUserParams.hasOwnProperty("password"))
            updateUserParams.password = await this.authService.hashPassword(updateUserParams.password);  
        await user.update(updateUserParams);
        
        if(Array.isArray(updateUserParams.roles)) {
            await user.removeRoles();
            await user.setRoles(await this.rolesService.findSome(updateUserParams.roles));
        }

        if(updateUserDto.hasOwnProperty("user.departmentId")) {
            await user.setDepartment(await this.departmentsService.findOneById(updateUserDto.departmentId));
        }
        
        return await this.userRepository.findByPk(id);
    }

    async findAll(options: FindOptions = {}): Promise<User[]> {
        options = {
            ...options,
            include: [
                User.associations.roles,
                //User.associations.department
            ],
            attributes: { exclude: ['password'] }
        }
        return await this.userRepository.findAll<User>(options);
    }

    async delete(id: number) {
        return await this.userRepository.destroy({
            where: { 
                id,
                name: {
                    [Op.notIn]: ["guest", "admin"]
                }
            }
        });
    }

    async softdelete(id: number) {
        const user = await this.userRepository.findByPk(id);

        if(!user)
            throw new NotFoundException('This user doesn\'t exist');
        
        user.deleted = true;

        return await user.save();
    }

    async restore(id: number) {
        const user = await this.userRepository.findByPk(id);

        if(!user)
            throw new NotFoundException('This user doesn\'t exist');
        
        user.deleted = false;

        return await user.save();
    }
}