import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Req, Request, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { DoesRoleExist } from '../../core/guards/doesRoleExist.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { RoleDto } from './dto/role.dto';
import { Roles } from '../../core/decorators/roles/roles.decorator';
import { FindOptions, Op } from 'sequelize';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) {}

    @UseGuards(DoesRoleExist)
    @Post()
    @Roles('admin')
    async create(@Body() role: RoleDto) {
        return await this.roleService.create(role);
    }
    
    @Get()
    async findAll(@Req() request) {
        return await this.roleService.findAll(request.user.roles.includes("admin") ? null :
            <FindOptions>{
                where: {
                    name: {
                        [Op.in]: request.user.roles.includes("departmenthead") ?
                            ["employee", "employeero", "firstline"].concat(request.user.roles) :
                            request.user.roles
                    }
                }
            });
    }
    
    @Get(':id')
    @Roles('admin')
    async findOne(@Param('id') id: number): Promise<Role> {
        const role = await this.roleService.findOne(id);

        if (!role) {
            throw new NotFoundException('This Role doesn\'t exist');
        }

        return role;
    }

    @UseGuards(DoesRoleExist)
    @Put(':id')
    @Roles('admin')
    async update(@Param('id') id: number, @Body() role: RoleDto, @Request() req): Promise<Role> {
        const { numberOfAffectedRows, updatedRole } = await this.roleService.update(id, role);

        if (numberOfAffectedRows === 0) {
            throw new NotFoundException('This Role doesn\'t exist');
        }

        return updatedRole;
    }
    
    @Delete(':id')
    @Roles('admin')
    async remove(@Param('id') id: number) {
        const deleted = await this.roleService.delete(id);

        if (deleted === 0) {
            throw new NotFoundException('This Role doesn\'t exist');
        }

        return { message: 'Successfully deleted' }
    }    
}