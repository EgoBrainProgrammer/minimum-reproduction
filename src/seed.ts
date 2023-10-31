import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Seeder } from './core/database/seeders/seeder';
import { SeederModule } from './core/database/seeders/seeder.module';

async function bootstrap() {
	NestFactory.createApplicationContext(SeederModule)
		.then(appContext => {
			const logger = appContext.get(Logger);
			const seeder = appContext.get(Seeder);

			seeder
				.seed()
				.then(() => {
					logger.log('Загрузка данных завершена успешно!');
				})
				.catch(error => {
					logger.log('Загрузка данных завершена с ошибкой!');
					throw error;
				})
				.finally(() => appContext.close());
		})
		.catch(error => {
			throw error;
		});
}
bootstrap();