import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types';
import { Request } from 'express';
@Injectable()
export class GetMessageTokentrategy extends PassportStrategy(
  Strategy,
  'jwt-getmessage',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        GetMessageTokentrategy.extractJwtCookies,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: config.getOrThrow('GETMESSAGE_SECRET_TOKEN'),
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }

  private static extractJwtCookies(req: Request) {
    if (
      req.cookies &&
      'user_token_getmessage' in req.cookies &&
      req.cookies.user_token_getmessage.length > 0
    ) {
      return req.cookies.user_token_getmessage;
    }

    return null;
  }
}
