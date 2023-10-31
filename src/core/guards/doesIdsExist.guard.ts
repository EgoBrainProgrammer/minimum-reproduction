import { BadRequestException, CanActivate, ExecutionContext, mixin, Type } from "@nestjs/common";
import { Op } from "sequelize";

export const DoesIdsExistGuard = (attributeName: string, model: any): Type<CanActivate> => {
    class DoesIdsExistGuardMixin implements CanActivate {
        canActivate(context: ExecutionContext) {
            return this.validateRequest(context.switchToHttp().getRequest());
        }

        async validateRequest(request) {
            let result = true;

            const ids = request.body[attributeName];

            if (Array.isArray(ids)) {
                for (const id of ids) {
                    if (!Number.isInteger(id) || id < 1) {
                        result = false;
                        break;
                    }
                }

                if (result)
                    result = ids.length == await model.count({
                        where: {
                            id: {
                                [Op.in]: ids
                            }
                        }
                    });

                if (!result)
                    throw new BadRequestException(`Entity ${model.name} does not contain instances with ids: ${ids}`);
            }

            if (Number.isInteger(ids) && ids > 0 && await model.count({
                where: {
                    id: ids
                }
            }) < 1)
                throw new BadRequestException(`Entity ${model.name} does not contain instance with id: ${ids}`);

            return result;
        }
    }

    const guard = mixin(DoesIdsExistGuardMixin);
    return guard;
}