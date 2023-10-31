import { forwardRef, Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './constants';
import { RolesModule } from '../roles/roles.module';
import { authProviders } from './providers/auth.providers';
import { DepartmentsModule } from '../departments/departments.module';

@Module({
	imports: [
		PassportModule,
		forwardRef(() => UsersModule),
		RolesModule,
		JwtModule.register({
			secret: jwtConstants.key,
			signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXP },
		}),
		DepartmentsModule,
	],
	exports: [AuthService],
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy,
		Logger,
		...authProviders
	],
	controllers: [AuthController],
})
export class AuthModule {}