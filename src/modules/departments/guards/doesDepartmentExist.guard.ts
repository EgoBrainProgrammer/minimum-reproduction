import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DepartmentsService } from '../departments.service';

@Injectable()
export class DoesDepartmentExist implements CanActivate {
    constructor(private readonly departmentService: DepartmentsService) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        switch(true) {
            case (request.body.hasOwnProperty('name') && await this.departmentService.findOneByName(request.body.name) != null): 
                throw new ForbiddenException('This department already exist');

            default: return true;
        }
    }
}