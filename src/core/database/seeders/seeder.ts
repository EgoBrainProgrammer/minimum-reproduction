import { Injectable, Logger, NotFoundException, Optional } from "@nestjs/common";
import { DepartmentsService } from "../../../modules/departments/departments.service";
import { RolesService } from "../../../modules/roles/roles.service";
import { UsersService } from "../../../modules/users/users.service";

@Injectable()
export class Seeder {
    constructor(private readonly logger: Logger,
        private readonly departmentsService: DepartmentsService,
        private readonly rolesService: RolesService,
        private readonly usersService: UsersService,
        ) {}
        
    async seed() {
        this.logger.log("Начало загрузки данных");

        if(process.argv.length > 2) {
            if(this[process.argv[2]])
                await this[process.argv[2]]();
            else
                throw new NotFoundException("Не найден метод для загрузки данных заданной сущности " + process.argv[2]);
        } else {
            //--Организации--
            await this.departments();

            //--Роли--
            await this.roles();

            //--Пользователи--
            await this.users();
        }
    }

    async departments() {
        this.logger.log("Организации");
        const departments = await this.departmentsService.bulkCreate(require("./departments/data").data);
        this.logger.log(departments.map(val => val.toJSON()));
        this.logger.log("Всего " + departments.length);
    }
    
    async roles() {
        this.logger.log("Роли");
        const roles = await this.rolesService.bulkCreate(require("./roles/data").data);
        this.logger.log(roles.map(val => val.toJSON()));
        this.logger.log("Всего " + roles.length);
    }

    async users() {
        this.logger.log("Пользователи");
        const users = [];
        const data = require("./users/data").data;
        for(let i = 0; i < data.length; ++i)
            users.push(await this.usersService.create(data[i]));
        
        this.logger.log(users.map(val => val.toJSON()));
        this.logger.log("Всего " + users.length);
    }
}