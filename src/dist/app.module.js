"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var serve_static_1 = require("@nestjs/serve-static");
var path_1 = require("path");
var database_module_1 = require("./core/database/database.module");
var auth_module_1 = require("./modules/auth/auth.module");
var departments_module_1 = require("./modules/departments/departments.module");
var entityhistory_module_1 = require("./modules/entityhistory/entityhistory.module");
var roles_module_1 = require("./modules/roles/roles.module");
var users_module_1 = require("./modules/users/users.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        common_1.Module({
            imports: [
                serve_static_1.ServeStaticModule.forRoot({
                    rootPath: path_1.join(__dirname, '..', 'public'),
                    exclude: ["/api(.*)"]
                }),
                database_module_1.DatabaseModule,
                entityhistory_module_1.EntityhistoryModule,
                auth_module_1.AuthModule,
                users_module_1.UsersModule,
                roles_module_1.RolesModule,
                departments_module_1.DepartmentsModule,
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
