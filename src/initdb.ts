import { NestFactory } from '@nestjs/core';
import { DatabaseModule } from './core/database/database.module';
import * as readline from 'readline';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

async function bootstrap() {
	NestFactory.createApplicationContext(DatabaseModule)
		.catch(error => {
			throw error;
		});
}

rl.question("Выполнить инициализацию БД (это приведёт к потере данных таблиц) (y/n)? ", answer => {
	if (["y", "Y", "Да", "да"].includes(answer.trim())) {
		console.log("Необходимо дождаться завершдение программы");
		bootstrap();
	}
	rl.close();
});