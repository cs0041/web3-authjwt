import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type JwrPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class AccessTokentrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow('ACCESS_SECRET_TOKEN'),
    });
  }

  validate(payload: JwrPayload) {
    return payload;
  }
}
