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
exports.databaseProviders = void 0;
var node_process_1 = require("node:process");
var sequelize_typescript_1 = require("sequelize-typescript");
var constants_1 = require("../constants");
var database_config_1 = require("./database.config");
var constants_2 = require("../constants");
var logging_1 = require("../logging");
var refreshtoken_entity_1 = require("../../modules/auth/entities/refreshtoken.entity");
var userrole_entity_1 = require("../../modules/users/entities/userrole.entity");
var department_entity_1 = require("../../modules/departments/entities/department.entity");
var entityedit_entity_1 = require("../../modules/entityhistory/entityedit.entity");
var entityhistory_entity_1 = require("../../modules/entityhistory/entityhistory.entity");
var role_entity_1 = require("../../modules/roles/entities/role.entity");
var user_entity_1 = require("../../modules/users/entities/user.entity");
var esatoken_entity_1 = require("src/modules/auth/entities/esatoken.entity");
exports.databaseProviders = [{
        provide: constants_1.SEQUELIZE,
        useFactory: function () { return __awaiter(void 0, void 0, void 0, function () {
            var config, sequelize;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        switch (process.env.NODE_ENV) {
                            case constants_1.DEVELOPMENT:
                                config = database_config_1.databaseConfig.development;
                                break;
                            case constants_1.TEST:
                                config = database_config_1.databaseConfig.test;
                                break;
                            case constants_1.PRODUCTION:
                                config = database_config_1.databaseConfig.production;
                                break;
                            default:
                                config = database_config_1.databaseConfig.development;
                        }
                        sequelize = new sequelize_typescript_1.Sequelize(__assign(__assign({}, config), { logging: function (msg) {
                                logging_1.log("./" + constants_2.LOGGING.DIR, constants_2.LOGGING.SQL.FILE, constants_2.LOGGING.SQL.MAXSIZE, new Date() + " " + msg + "\n");
                            } }));
                        sequelize.addModels([
                            user_entity_1.User, role_entity_1.Role, refreshtoken_entity_1.RefreshToken, esatoken_entity_1.EsaToken, entityedit_entity_1.EntityEdit, entityhistory_entity_1.EntityHistory, department_entity_1.Department,
                            //--Таблицы связей--
                            userrole_entity_1.UserRole,
                        ]);
                        if (!(node_process_1.argv.length > 1 && new RegExp(/initdb(\.ts)?$/).test(node_process_1.argv[1]))) return [3 /*break*/, 2];
                        console.log("Recreating database...");
                        return [4 /*yield*/, sequelize.sync({ force: true })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(node_process_1.argv.length > 1 && new RegExp(/syncdb(\.ts)?$/).test(node_process_1.argv[1]))) return [3 /*break*/, 4];
                        console.log("Synchronizing database...");
                        return [4 /*yield*/, sequelize.sync({ alter: true })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, sequelize];
                }
            });
        }); }
    }];
