import { Logger, Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';

@Module({
    imports: [DatabaseModule],
    providers: [Logger],
})
export class MigrationModule {}