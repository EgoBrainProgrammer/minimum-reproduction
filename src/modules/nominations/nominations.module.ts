import { Module } from '@nestjs/common';
import { NominationsController } from './nominations.controller';
import { NominationsService } from './nominations.service';
import { nominationsProviders } from './nominations.providers';

@Module({
  controllers: [NominationsController],
  providers: [NominationsService, ...nominationsProviders]
})
export class NominationsModule {}
