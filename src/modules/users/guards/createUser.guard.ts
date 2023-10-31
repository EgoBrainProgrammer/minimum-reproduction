import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RolesService } from 'src/modules/roles/roles.service';
import { FindOptions, Op } from 'sequelize';

@Injectable()
export class CreateUserGuard implements CanActivate {
    constructor(private readonly rolesService: RolesService) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        let result = false;

        const user = request.user;
        if(user && Array.isArray(user.roles) && 
            (user.roles.includes("admin") || 
                (user.departmentId === request.body.departmentId &&
                    (await this.rolesService.findAll(<FindOptions>{
                        attributes: ["id"],
                        where: {
                            name: {
                                [Op.in]: ["employee", "employeero"]
                            }
                        }
                    })).map(x => x.id).filter(x => request.body.roles.includes(x)).length > 0
                    )))
            result = true;

        if(!result)
            throw new BadRequestException("Задано недопустимое подразделение или недопустимые роли");

        return result;
    }
}