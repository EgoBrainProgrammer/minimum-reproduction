import { NestFactory } from '@nestjs/core';
import { DatabaseModule } from './core/database/database.module';

async function bootstrap() {
	NestFactory.createApplicationContext(DatabaseModule)
		.catch(error => {
			throw error;
		});
}

bootstrap();