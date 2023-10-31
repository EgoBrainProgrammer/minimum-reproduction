import { Module } from '@nestjs/common';
import { departmentsProviders } from './departments.providers';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { EntityhistoryModule } from '../entityhistory/entityhistory.module';

@Module({
    imports: [EntityhistoryModule],
    exports: [DepartmentsService],
    providers: [...departmentsProviders, DepartmentsService],
    controllers: [DepartmentsController],
})
export class DepartmentsModule {}
