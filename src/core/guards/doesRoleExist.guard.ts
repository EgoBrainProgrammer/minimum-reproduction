import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RolesService } from '../../modules/roles/roles.service';

@Injectable()
export class DoesRoleExist implements CanActivate {
    constructor(private readonly roleService: RolesService) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        switch(true) {
            case (request.body.hasOwnProperty('name') && await this.roleService.findOneByName(request.body.name) != null):
                throw new ForbiddenException('This role already exist');

            default: return true;
        }
    }
}