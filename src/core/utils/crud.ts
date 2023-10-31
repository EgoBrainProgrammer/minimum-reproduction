import { BadRequestException, ForbiddenException, NotFoundException } from "@nestjs/common";
import { CreateOptions, FindOptions, Includeable, OrderItem } from "sequelize";
import { parseFilter } from ".";
import { EntityhistoryService } from "../../modules/entityhistory/entityhistory.service";

async function crudCreate(params: { 
        request: any, 
        repository, 
        findOptions: FindOptions, 
        dto,
        include?: Includeable | Includeable[] | Boolean,
        setFunction?: string,
        setData?: Array<any>
    }, createOpstions: CreateOptions = null) {
    let instance = null;
    if (params.findOptions)
        instance = await params.repository.findOne(params.findOptions);

    if (instance)
        throw new BadRequestException('Dublicating data!');

    instance = await params.repository.create({ 
        ...params.dto, 
        createUserId: params.request ? params.request.user.id : null,
        createOpstions
    });

    if (params.setFunction && Array.isArray(params.setData))
        await instance[params.setFunction](params.setData);

    let extendedInclude: Array<any> = [{
        association: params.repository.associations.createUser,
        attributes: ["id", "login", "lastname", "name", "patronymic"]
    }];

    if (params.include)
        if (Array.isArray(params.include))
            extendedInclude = extendedInclude.concat(params.include);
        else
            extendedInclude.push(params.include);

    return await params.repository.findByPk(instance.id, {
        include: typeof params.include === "boolean" && params.include === false ? null : extendedInclude
    });
}

async function crudUpdate(request: any, repository, pk: number, dto, include?: Includeable | Includeable[] | Boolean,
    setFunction?: string, setData?: Array<any>, checkOwner: boolean = true) {
    const instance = await repository.findByPk(pk);
    if (!instance)
        throw new NotFoundException();

    if(checkOwner)
        if(!request.user.roles.includes('admin') && instance.createUserId != request.user.id)
            throw new ForbiddenException();

    await EntityhistoryService.updateAndCreate(request.user, 
        {...dto, updateUserId: request.user.id }, instance);

    if (setFunction && Array.isArray(setData))
        await instance[setFunction](setData);

    let extendedInclude: Array<any> = [{
        association: repository.associations.createUser,
        attributes: ["id", "login", "lastname", "name", "patronymic"],
    },{
        association: repository.associations.updateUser,
        attributes: ["id", "login", "lastname", "name", "patronymic"],
    }];

    if (include)
        if (Array.isArray(include))
            extendedInclude = extendedInclude.concat(include);
        else
            extendedInclude.push(include);

    return await repository.findByPk(pk, {
        include: typeof include === "boolean" && include === false ? null : extendedInclude
    });
}

async function crudDelete(request: any, repository, id: number): Promise<number> {
    const instance = await repository.findByPk(id);
    if (!instance)
        throw new NotFoundException();

    if(request.user && !request.user.roles.includes("admin") && instance.createUserId != request.user.id)
        throw new ForbiddenException();

    return await repository.destroy({
        where: {
            id
        }
    });
}

async function findAllExt(repository, findOptions: FindOptions = {}, 
    findOptionsFromQuery: string | object = null) {

    if(findOptions == null)
        findOptions = {};

    const parsedFindOptionsFromQuery = {
        where: null,
        order: null,
        limit: null,
        offset: null
    };
    if(findOptionsFromQuery)
        Object.assign(parsedFindOptionsFromQuery, 
            typeof findOptionsFromQuery === "string" ? JSON.parse(findOptionsFromQuery) : findOptionsFromQuery);

    if(parsedFindOptionsFromQuery.where) {
        parsedFindOptionsFromQuery.where = parseFilter(parsedFindOptionsFromQuery.where);
        findOptions.where = Object.assign(findOptions.where ? findOptions.where : {},
            parsedFindOptionsFromQuery.where);
    }

    let include: Array<any> = [];
    if(repository.associations.hasOwnProperty("createUser"))
        include.push(
        {
            association: repository.associations.createUser,
            attributes: ["lastname", "name", "patronymic"]
        });

    if(repository.associations.hasOwnProperty("updateUser"))
        include.push(
        {
            association: repository.associations.updateUser,
            attributes: ["lastname", "name", "patronymic"]
        });

    if(findOptions && findOptions.include != null) {
        if(Array.isArray(findOptions.include))
            include = include.concat(<Array<any>>findOptions.include);
        else
            include.push(<Includeable>findOptions.include);
    }

    findOptions.include = include;

    let order: OrderItem[] = [];
    if(findOptions && findOptions.order != null) {
        if(Array.isArray(findOptions.order))
            order = order.concat(<Array<any>>findOptions.order);
        else
            order.push(findOptions.order);
    }
    if(parsedFindOptionsFromQuery.order) {
        if(Array.isArray(parsedFindOptionsFromQuery.order))
            order = order.concat(parsedFindOptionsFromQuery.order);
        else
            order.push(parsedFindOptionsFromQuery.order);
    }

    findOptions.order = order;

    if(findOptions.limit === null && parsedFindOptionsFromQuery.limit !== null)
        findOptions.limit = parsedFindOptionsFromQuery.limit;

    if(findOptions.offset === null && parsedFindOptionsFromQuery.offset !== null)
        findOptions.offset = parsedFindOptionsFromQuery.offset;

    return await repository.findAll(findOptions);
}

export { crudCreate, crudUpdate, crudDelete, findAllExt }