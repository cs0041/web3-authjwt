import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types';
@Injectable()
export class GetMessageTokentrategy extends PassportStrategy(
  Strategy,
  'jwt-getmessage',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow('GETMESSAGE_SECRET_TOKEN'),
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
