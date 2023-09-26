import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Res,
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
import { Response } from 'express';
import { TokenGetMessage } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('getsignmessage')
  @HttpCode(HttpStatus.OK)
  async getSignMessage(
    @Body() dto: GetMessageDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { getmessage_token, message } = await this.authService.getSignMessage(
      dto,
    );
    res.cookie('user_token_getmessage', getmessage_token, {
      expires: new Date(Date.now() + 60 * 60 * 24 * 7), // 7 days),
      httpOnly: true,
    });
    return { message };
  }

  @UseGuards(GetMessageTokenGuard)
  @Post('loginverifymessage')
  @HttpCode(HttpStatus.OK)
  async loginVerifyMessage(
    @Body() dto: LoginVerifyDto,
    @GetDataUser('nonce') nonce: string,
    @GetDataUser('address') address: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } =
      await this.authService.loginVerifyMessage(address, nonce, dto);

    res.cookie('user_token_accesstoken', access_token, {
      expires: new Date(Date.now() + 60 * 60 * 24 * 7), // 7 days),
      httpOnly: true,
    });

    res.cookie('user_token_refreshtoken', refresh_token, {
      expires: new Date(Date.now() + 60 * 60 * 24 * 7), // 7 days),
      httpOnly: true,
    });

    return {};
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refreshtokens')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetDataUser('address') address: string,
    @GetDataUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } =
      await this.authService.getRefreshTokens(address, refreshToken);

    res.cookie('user_token_accesstoken', access_token, {
      expires: new Date(Date.now() + 60 * 60 * 24 * 7), // 7 days),
      httpOnly: true,
    });

    res.cookie('user_token_refreshtoken', refresh_token, {
      expires: new Date(Date.now() + 60 * 60 * 24 * 7), // 7 days),
      httpOnly: true,
    });
    return {};
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @GetDataUser('address') address: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie('user_token_accesstoken', '', {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.cookie('user_token_refreshtoken', '', {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    return this.authService.logout(address);
  }

  @UseGuards(AccessTokenGuard)
  @Get('getme')
  getMe() {
    return 'finally get me';
  }
}
