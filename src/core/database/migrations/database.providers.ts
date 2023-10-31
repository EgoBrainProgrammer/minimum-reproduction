import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../../constants';
import { databaseConfig } from '../database.config';
import { LOGGING } from "../../constants";
import { log } from "../../logging";

export const databaseProviders = [{
    provide: SEQUELIZE,
    useFactory: async () => {
        let config;
        switch (process.env.NODE_ENV) {
            case DEVELOPMENT:
                config = databaseConfig.development;
                break;
            case TEST:
                config = databaseConfig.test;
                break;
            case PRODUCTION:
                config = databaseConfig.production;
                break;
            default:
                config = databaseConfig.development;
        }
        const sequelize = new Sequelize({
            ...config,
            logging: msg => {
                log(`./${LOGGING.DIR}`, LOGGING.SQL.FILE, LOGGING.SQL.MAXSIZE, `${new Date()} ${msg}\n`);                
            }
        });
        sequelize.addModels([
            
        ]);

        await sequelize.sync({
            alter: true
        });

        return sequelize;
    },
}];