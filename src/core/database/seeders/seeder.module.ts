import { Logger, Module } from '@nestjs/common';
import { DepartmentsModule } from '../../../modules/departments/departments.module';
import { RolesModule } from '../../../modules/roles/roles.module';
import { UsersModule } from '../../../modules/users/users.module';
import { DatabaseModule } from '../database.module';
import { Seeder } from './seeder';

@Module({
    imports: [DatabaseModule, DepartmentsModule, RolesModule, UsersModule],
    providers: [Logger, Seeder],
})
export class SeederModule {}