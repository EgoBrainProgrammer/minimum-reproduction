import { argv } from 'node:process';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { LOGGING } from "../constants";
import { log } from "../logging";
import { RefreshToken } from '../../modules/auth/entities/refreshtoken.entity';
import { UserRole } from '../../modules/users/entities/userrole.entity';
import { Department } from '../../modules/departments/entities/department.entity';
import { EntityEdit } from '../../modules/entityhistory/entityedit.entity';
import { EntityHistory } from '../../modules/entityhistory/entityhistory.entity';
import { Role } from '../../modules/roles/entities/role.entity';
import { User } from '../../modules/users/entities/user.entity';
import { EsaToken } from 'src/modules/auth/entities/esatoken.entity';

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
            User, Role, RefreshToken, EsaToken, EntityEdit, EntityHistory, Department,

            //--Таблицы связей--
            UserRole,

            //--Справочники--
        ]);

        if(argv.length > 1 && new RegExp(/initdb(\.ts)?$/).test(argv[1])) {
            console.log("Recreating database...");
            await sequelize.sync({ force: true });
        }

        if(argv.length > 1 && new RegExp(/syncdb(\.ts)?$/).test(argv[1])) {
            console.log("Synchronizing database...");
            await sequelize.sync({ alter: true });
        }

        return sequelize;
    },
}];