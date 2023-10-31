import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as dotenv from 'dotenv';
import { DEVELOPMENT, LOGGING, PRODUCTION } from './core/constants';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule,
      {
          logger: WinstonModule.createLogger({
              exitOnError: false,
              transports: [
                  new winston.transports.Console({
                      format: winston.format.combine(
                          winston.format.ms(),
                          winston.format.timestamp(),
                          nestWinstonModuleUtilities.format.nestLike(),
                      ),
                  }),
                  new winston.transports.Console({
                      level: "error",
                      format: winston.format.combine(
                          winston.format.ms(),
                          winston.format.timestamp(),
                          nestWinstonModuleUtilities.format.nestLike(),
                          winston.format.printf(({ stack }) => {
                              return stack;
                          })
                      ),
                  }),
                  new winston.transports.File({
                      maxsize: LOGGING.MAIN.MAXSIZE,
                      dirname: LOGGING.DIR,
                      filename: LOGGING.MAIN.FILE,
                      format: winston.format.combine(
                          winston.format.timestamp(),
                          nestWinstonModuleUtilities.format.nestLike(),
                          winston.format.printf(({ context, level, message, timestamp }) => {
                              return `${timestamp}  [${level}]  [${context}]: ${message}`;
                          })
                      )
                  }),
                  new winston.transports.File({
                      maxsize: LOGGING.ERROR.MAXSIZE,
                      dirname: LOGGING.DIR,
                      filename: LOGGING.ERROR.FILE,
                      level: "error",
                      format: winston.format.combine(
                          winston.format.timestamp(),
                          nestWinstonModuleUtilities.format.nestLike(),
                          winston.format.printf(({ context, level, message, timestamp, stack }) => {
                              return `${timestamp}  [${level}]  [${context}]: ${message}` + "\n\t" + stack;
                          })
                      )
                  })]
          })
      });

  app.use(json({ limit: process.env.HTTP_BODY_LIMIT }));
  app.setGlobalPrefix('api', { 
      //exclude: ["/auth/callback"] 
  });

  app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
  }));

  if ((process.env.NODE_ENV || PRODUCTION) === DEVELOPMENT) {
      app.enableCors({
          exposedHeaders: "Content-Disposition"
      });
  }

  await app.listen(process.env.HTTP_PORT);
}
bootstrap();