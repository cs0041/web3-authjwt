import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
type JwrPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class AccessTokentrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        AccessTokentrategy.extractJwtCookies,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: config.getOrThrow('ACCESS_SECRET_TOKEN'),
    });
  }

  validate(payload: JwrPayload) {
    return payload;
  }

  private static extractJwtCookies(req: Request) {
    if (
      req.cookies &&
      'user_token_accesstoken' in req.cookies &&
      req.cookies.user_token_accesstoken.length > 0
    ) {
      return req.cookies.user_token_accesstoken;
    }

    return null;
  }
}
