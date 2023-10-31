import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../core/decorators/roles/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create.department.dto';
import { UpdateDepartmentDto } from './dto/update.department.dto';
import { DoesDepartmentExist } from './guards/doesDepartmentExist.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('departments')
export class DepartmentsController {
    constructor(private departmentService: DepartmentsService) {}

    @UseGuards(DoesDepartmentExist)
    @Post()
    @Roles('admin')
    async create(@Req() req, @Body() department: CreateDepartmentDto) {
        return await this.departmentService.create(req, department);
    }
    
    @Get()
    async findAll(@Req() request, @Query() query) {        
        const queryFindOptions = query.findOptions ? JSON.parse(query.findOptions) : {};
        if(!request.user.roles.includes('admin'))
            queryFindOptions.id = request.user.departmentId;

        return (await this.departmentService.findAll(null, queryFindOptions)).
            map(val => { return { ...val.toJSON() }});
    }

    @Put(':id')
    @Roles('admin')
    async update(@Req() req, @Param('id') id: number, @Body() departmentDto: UpdateDepartmentDto) {
        return await this.departmentService.update(req, id, departmentDto);
    }

    @Delete(':id')
    @Roles('admin')
    async delete(@Param('id') id: number) {
        const deleted = await this.departmentService.remove(id);

        if (deleted === 0)
            throw new NotFoundException('This department doesn\'t exist');

        return { message: 'Removed!' }
    }
}