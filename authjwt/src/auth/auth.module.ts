import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import {
  RefreshTokentrategy,
  AccessTokentrategy,
  GetMessageTokentrategy,
} from './strategies';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    AuthService,
    RefreshTokentrategy,
    AccessTokentrategy,
    GetMessageTokentrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
