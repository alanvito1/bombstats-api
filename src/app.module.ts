import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'dbsenha',
      database: process.env.DB_NAME || 'bombstats',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Migrations will handle the DB schema
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
