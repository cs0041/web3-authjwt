import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AccessTokenGuard,
  GetMessageTokenGuard,
  RefreshTokenGuard,
} from './guards';
import { GetMessageDto } from './dto';
import { GetDataUser } from './decorators';
import { LoginVerifyDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(GetMessageTokenGuard)
  @Post('loginverifymessage')
  @HttpCode(HttpStatus.OK)
  loginVerifyMessage(
    @Body() dto: LoginVerifyDto,
    @GetDataUser('nonce') nonce: string,
    @GetDataUser('address') address: string,
  ) {
    return this.authService.loginVerifyMessage(address, nonce, dto);
  }

  @Get('getsignmessage')
  @HttpCode(HttpStatus.OK)
  getSignMessage(@Body() dto: GetMessageDto) {
    return this.authService.getSignMessage(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('getme')
  getMe() {
    return 'finally get me';
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshTokens() {
    return 'refreshTokens';
  }
}
