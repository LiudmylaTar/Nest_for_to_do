import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';


@Module({
    imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const user = config.get<string>('MONGODB_USER');
        const pass = config.get<string>('MONGODB_PASSWORD');
        const url = config.get<string>('MONGODB_URL');
        const db = config.get<string>('MONGODB_DB');

        return {
          uri: `mongodb+srv://${user}:${pass}@${url}/${db}?retryWrites=true&w=majority`,
        };
      },
    }),
    AuthModule,
    UsersModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
