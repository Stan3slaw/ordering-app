import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RmqModule } from '@app/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from './modules/jwt/jwt.module';
import { USER_SERVICE } from './constants/services.constants';
import { envConfigValidationSchema } from './config/env-config.schema';
import { envConfig } from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envConfigValidationSchema,
      load: [envConfig],
    }),
    RmqModule.register({
      name: USER_SERVICE,
    }),
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
