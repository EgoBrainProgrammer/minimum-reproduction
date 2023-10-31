import { Type, CanActivate, ExecutionContext, mixin, ForbiddenException } from "@nestjs/common";

export const CheckOwnerGuard = (model: any): Type<CanActivate> => {
    class DoesIdsExistGuardMixin implements CanActivate {
        canActivate(context: ExecutionContext) {
            return this.validateRequest(context.switchToHttp().getRequest());
        }

        async validateRequest(request) {
            if(request.user && request.params && Number.isInteger(Number(request.params.id)) && 
                Number(request.params.id) > 0) {
                const instance = await model.findByPk(request.params.id);
                if(instance && instance.createUserId != request.user.id)
                    throw new ForbiddenException("This operation permitted only for object creator")
            }

            return true;
        }
    }

    const guard = mixin(DoesIdsExistGuardMixin);
    return guard;
}