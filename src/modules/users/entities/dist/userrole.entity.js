"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserRole = void 0;
var sequelize_typescript_1 = require("sequelize-typescript");
var role_entity_1 = require("../../roles/entities/role.entity");
var user_entity_1 = require("./user.entity");
var UserRole = /** @class */ (function (_super) {
    __extends(UserRole, _super);
    function UserRole() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return user_entity_1.User; }),
        sequelize_typescript_1.Column
    ], UserRole.prototype, "userId");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return role_entity_1.Role; }),
        sequelize_typescript_1.Column
    ], UserRole.prototype, "roleId");
    UserRole = __decorate([
        sequelize_typescript_1.Table
    ], UserRole);
    return UserRole;
}(sequelize_typescript_1.Model));
exports.UserRole = UserRole;
