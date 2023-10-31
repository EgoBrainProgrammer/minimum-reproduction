import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from './core/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { EntityhistoryModule } from './modules/entityhistory/entityhistory.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { NominationsModule } from './modules/nominations/nominations.module';
import { CandidatesModule } from './modules/candidates/candidates.module';
import { VotesModule } from './modules/votes/votes.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ["/api(.*)"]
    }),
    DatabaseModule,
    EntityhistoryModule,
    AuthModule,
    UsersModule,
    RolesModule,
    DepartmentsModule,
    NominationsModule,
    CandidatesModule,
    VotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
