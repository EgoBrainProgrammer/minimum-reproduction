import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		let result: boolean = false;

		const request = context.switchToHttp().getRequest();

		const user = request.user;

		const reqroles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		]);

		if (!reqroles)
			return true;

		if(Array.isArray(user.roles)) {
			if(user.roles.findIndex(x => ["admin"].includes(x)) > -1)
				result = true;
			else
				for(let i = 0; i < reqroles.length; ++i)
					if(user.roles.includes(reqroles[i])) {
						result = true;
						break;
					}
		}

		return result;
	}
}
