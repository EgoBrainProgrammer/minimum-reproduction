import { Logger, Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';

@Module({
    providers: [Logger, ...databaseProviders],
    exports: [...databaseProviders],
})
export class DatabaseModule {}