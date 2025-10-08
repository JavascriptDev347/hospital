import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import { PrismaModule } from './prisma/prisma.module';
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
      AuthModule,
  ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
  }),
  PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
