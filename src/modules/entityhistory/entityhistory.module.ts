import { Module } from '@nestjs/common';
import { entityHistoryProviders } from './entityhistory.providers';
import { EntityhistoryService } from './entityhistory.service';

@Module({
	exports: [EntityhistoryService],
	providers: [EntityhistoryService, ...entityHistoryProviders]
})
export class EntityhistoryModule {}