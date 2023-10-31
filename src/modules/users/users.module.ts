import { forwardRef, Module } from '@nestjs/common';
import { usersProviders } from './users.providers';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { DepartmentsModule } from '../departments/departments.module';

@Module({
	imports: [RolesModule, forwardRef(() => AuthModule), DepartmentsModule],
	exports: [UsersService],
	providers: [UsersService, ...usersProviders],
	controllers: [UsersController]
})
export class UsersModule {}