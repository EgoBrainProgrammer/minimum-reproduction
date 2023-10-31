import { AuthGuard } from '@nestjs/passport';
import { FindOptions, Op } from 'sequelize';
import { Controller, Put, UseGuards, Body, Param, UseInterceptors, ClassSerializerInterceptor, Get, Delete, Post, Req, Patch } from '@nestjs/common';
import { Roles } from '../../core/decorators/roles/roles.decorator';
import { DoesUserExist } from './guards/doesUserExist.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { CreateUserDto } from './dto/create.user.dto';
import { ResponseUserDto } from './dto/response.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { UsersService } from './users.service';
import { CreateUserGuard } from './guards/createUser.guard';
import { ParamIdDto } from 'src/core/dto/param.id.dto';
import { DeleteUserGuard } from './guards/deleteUser.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }
    
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(DoesUserExist, CreateUserGuard)
    @Post()
    @Roles('departmenthead')
    async create(@Body() userDto: CreateUserDto): Promise<ResponseUserDto> {
        return new ResponseUserDto(await this.usersService.normalize(await this.usersService.create(userDto), false));
    }

    @Get()
    @Roles('departmenthead')
    async findAll(@Req() request) {
        const result = [];

        const where = {
            id: {
                [Op.notIn]: [1, 2]
            },
            login: {
                [Op.notIn]: ["guest", "admin"]
            }
        };

        if(!request.user.roles.includes("admin"))
            where["departmentId"] = request.user.departmentId;

        const users = await this.usersService.findAll(<FindOptions>{
            where
        });
        for (let i = 0; i < users.length; ++i)
            result.push(await this.usersService.normalize(users[i], false));
        return result;
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(CreateUserGuard)
    @Put(':id')
    @Roles('departmenthead')
    async update(@Param('id') id: number, @Body() userDto: UpdateUserDto): Promise<ResponseUserDto> {
        return new ResponseUserDto(await this.usersService.normalize(await this.usersService.update(id, userDto), false));
    }

    @UseGuards(DeleteUserGuard)
    @Delete(':id')
    @Roles('departmenthead')
    async removeUser(@Param() param: ParamIdDto) {
        // const deleted = await this.usersService.delete(param.id);

        // if (deleted === 0)
        //     throw new NotFoundException('This user doesn\'t exist');

        // return deleted;
        return await this.usersService.softdelete(param.id);
    }

    @UseGuards(DeleteUserGuard)
    @Patch(':id')
    @Roles('departmenthead')
    async restoreUser(@Param() param: ParamIdDto) {
        return await this.usersService.restore(param.id);
    }
}
