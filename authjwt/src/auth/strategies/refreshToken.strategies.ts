import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokentrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokentrategy.extractJwtCookies,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: config.getOrThrow('REFRESH_SECRET_TOKEN'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();

    return {
      ...payload,
      refreshToken,
    };
  }

  private static extractJwtCookies(req: Request) {
    if (
      req.cookies &&
      'user_token_refreshtoken' in req.cookies &&
      req.cookies.user_token_refreshtoken.length > 0
    ) {
      return req.cookies.user_token_refreshtoken;
    }

    return null;
  }
}
