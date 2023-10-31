import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';

@Injectable()
export class DoesUserExist implements CanActivate {
    constructor(private readonly userService: UsersService) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        switch(true) {
            case (request.body.hasOwnProperty('login') && await this.userService.findOneByLogin(request.body.login) != null): 
                throw new ForbiddenException('This login already exist');

            case (request.body.hasOwnProperty('email') && await this.userService.findOneByEmail(request.body.email) != null):
                throw new ForbiddenException('This email already exist');

            default: return true;
        }
    }
}