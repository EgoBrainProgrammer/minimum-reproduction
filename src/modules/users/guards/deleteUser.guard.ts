import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';

@Injectable()
export class DeleteUserGuard implements CanActivate {
    constructor(private readonly usersService: UsersService) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const deletingUser = await this.usersService.findOneById(request.params.id);

        const user = request.user;
        if (deletingUser && user && Array.isArray(user.roles) && !user.roles.includes("admin") &&
                user.departmentId != deletingUser.departmentId)
            throw new BadRequestException("Задан недопустимый пользователь");

        return true;
    }
}