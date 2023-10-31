"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.findAllExt = exports.crudDelete = exports.crudUpdate = exports.crudCreate = void 0;
var common_1 = require("@nestjs/common");
var _1 = require(".");
var entityhistory_service_1 = require("../../modules/entityhistory/entityhistory.service");
function crudCreate(params, createOpstions) {
    if (createOpstions === void 0) { createOpstions = null; }
    return __awaiter(this, void 0, void 0, function () {
        var instance, extendedInclude;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    instance = null;
                    if (!params.findOptions) return [3 /*break*/, 2];
                    return [4 /*yield*/, params.repository.findOne(params.findOptions)];
                case 1:
                    instance = _a.sent();
                    _a.label = 2;
                case 2:
                    if (instance)
                        throw new common_1.BadRequestException('Dublicating data!');
                    return [4 /*yield*/, params.repository.create(__assign(__assign({}, params.dto), { createUserId: params.request ? params.request.user.id : null }), createOpstions)];
                case 3:
                    instance = _a.sent();
                    if (!(params.setFunction && Array.isArray(params.setData))) return [3 /*break*/, 5];
                    return [4 /*yield*/, instance[params.setFunction](params.setData)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    extendedInclude = [{
                            association: params.repository.associations.createUser,
                            attributes: ["id", "login", "lastname", "name", "patronymic"]
                        }];
                    if (params.include)
                        if (Array.isArray(params.include))
                            extendedInclude = extendedInclude.concat(params.include);
                        else
                            extendedInclude.push(params.include);
                    return [4 /*yield*/, params.repository.findByPk(instance.id, {
                            include: typeof params.include === "boolean" && params.include === false ? null : extendedInclude
                        })];
                case 6: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.crudCreate = crudCreate;
function crudUpdate(request, repository, pk, dto, include, setFunction, setData, checkOwner) {
    if (checkOwner === void 0) { checkOwner = true; }
    return __awaiter(this, void 0, void 0, function () {
        var instance, extendedInclude;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, repository.findByPk(pk)];
                case 1:
                    instance = _a.sent();
                    if (!instance)
                        throw new common_1.NotFoundException();
                    if (checkOwner)
                        if (!request.user.roles.includes('admin') && instance.createUserId != request.user.id)
                            throw new common_1.ForbiddenException();
                    return [4 /*yield*/, entityhistory_service_1.EntityhistoryService.updateAndCreate(request.user, __assign(__assign({}, dto), { updateUserId: request.user.id }), instance)];
                case 2:
                    _a.sent();
                    if (!(setFunction && Array.isArray(setData))) return [3 /*break*/, 4];
                    return [4 /*yield*/, instance[setFunction](setData)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    extendedInclude = [{
                            association: repository.associations.createUser,
                            attributes: ["id", "login", "lastname", "name", "patronymic"]
                        }, {
                            association: repository.associations.updateUser,
                            attributes: ["id", "login", "lastname", "name", "patronymic"]
                        }];
                    if (include)
                        if (Array.isArray(include))
                            extendedInclude = extendedInclude.concat(include);
                        else
                            extendedInclude.push(include);
                    return [4 /*yield*/, repository.findByPk(pk, {
                            include: typeof include === "boolean" && include === false ? null : extendedInclude
                        })];
                case 5: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.crudUpdate = crudUpdate;
function crudDelete(request, repository, id) {
    return __awaiter(this, void 0, Promise, function () {
        var instance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, repository.findByPk(id)];
                case 1:
                    instance = _a.sent();
                    if (!instance)
                        throw new common_1.NotFoundException();
                    if (request.user && !request.user.roles.includes("admin") && instance.createUserId != request.user.id)
                        throw new common_1.ForbiddenException();
                    return [4 /*yield*/, repository.destroy({
                            where: {
                                id: id
                            }
                        })];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.crudDelete = crudDelete;
function findAllExt(repository, findOptions, findOptionsFromQuery) {
    if (findOptions === void 0) { findOptions = {}; }
    if (findOptionsFromQuery === void 0) { findOptionsFromQuery = null; }
    return __awaiter(this, void 0, void 0, function () {
        var parsedFindOptionsFromQuery, include, order;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (findOptions == null)
                        findOptions = {};
                    parsedFindOptionsFromQuery = {
                        where: null,
                        order: null,
                        limit: null,
                        offset: null
                    };
                    if (findOptionsFromQuery)
                        Object.assign(parsedFindOptionsFromQuery, typeof findOptionsFromQuery === "string" ? JSON.parse(findOptionsFromQuery) : findOptionsFromQuery);
                    if (parsedFindOptionsFromQuery.where) {
                        parsedFindOptionsFromQuery.where = _1.parseFilter(parsedFindOptionsFromQuery.where);
                        findOptions.where = Object.assign(findOptions.where ? findOptions.where : {}, parsedFindOptionsFromQuery.where);
                    }
                    include = [];
                    if (repository.associations.hasOwnProperty("createUser"))
                        include.push({
                            association: repository.associations.createUser,
                            attributes: ["lastname", "name", "patronymic"]
                        });
                    if (repository.associations.hasOwnProperty("updateUser"))
                        include.push({
                            association: repository.associations.updateUser,
                            attributes: ["lastname", "name", "patronymic"]
                        });
                    if (findOptions && findOptions.include != null) {
                        if (Array.isArray(findOptions.include))
                            include = include.concat(findOptions.include);
                        else
                            include.push(findOptions.include);
                    }
                    findOptions.include = include;
                    order = [];
                    if (findOptions && findOptions.order != null) {
                        if (Array.isArray(findOptions.order))
                            order = order.concat(findOptions.order);
                        else
                            order.push(findOptions.order);
                    }
                    if (parsedFindOptionsFromQuery.order) {
                        if (Array.isArray(parsedFindOptionsFromQuery.order))
                            order = order.concat(parsedFindOptionsFromQuery.order);
                        else
                            order.push(parsedFindOptionsFromQuery.order);
                    }
                    findOptions.order = order;
                    if (findOptions.limit === null && parsedFindOptionsFromQuery.limit !== null)
                        findOptions.limit = parsedFindOptionsFromQuery.limit;
                    if (findOptions.offset === null && parsedFindOptionsFromQuery.offset !== null)
                        findOptions.offset = parsedFindOptionsFromQuery.offset;
                    return [4 /*yield*/, repository.findAll(findOptions)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.findAllExt = findAllExt;
