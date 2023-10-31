import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { rolesProviders } from './roles.providers';
import { DatabaseModule } from '../../core/database/database.module';

@Module({
  imports: [DatabaseModule],
  exports: [RolesService],
  providers: [
    RolesService,
    ...rolesProviders],
  controllers: [RolesController]
})
export class RolesModule {}