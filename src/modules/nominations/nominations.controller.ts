import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { NominationsService } from './nominations.service';
import { Roles } from 'src/core/decorators/roles/roles.decorator';
import { CreateNominationDto } from './dto/create.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('nominations')
export class NominationsController {
    constructor(private service: NominationsService) {}

    @Post()
    @Roles('admin')
    async create(@Req() req, @Body() body: CreateNominationDto) {
        return await this.service.create(req, body);
    }
    
    // @Get()
    // async findAll(@Req() request, @Query() query) {        
    //     const queryFindOptions = query.findOptions ? JSON.parse(query.findOptions) : {};
    //     if(!request.user.roles.includes('admin'))
    //         queryFindOptions.id = request.user.departmentId;

    //     return (await this.departmentService.findAll(null, queryFindOptions)).
    //         map(val => { return { ...val.toJSON() }});
    // }

    // @Put(':id')
    // @Roles('admin')
    // async update(@Req() req, @Param('id') id: number, @Body() departmentDto: UpdateDepartmentDto) {
    //     return await this.departmentService.update(req, id, departmentDto);
    // }

    // @Delete(':id')
    // @Roles('admin')
    // async delete(@Param('id') id: number) {
    //     const deleted = await this.departmentService.remove(id);

    //     if (deleted === 0)
    //         throw new NotFoundException('This department doesn\'t exist');

    //     return { message: 'Removed!' }
    // }
}
