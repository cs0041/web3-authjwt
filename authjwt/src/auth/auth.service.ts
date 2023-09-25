import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetMessageDto } from './dto';
import { JwtPayload, ResultGetMessage } from './types';
import { ConfigService } from '@nestjs/config';
import { LoginVerifyDto } from './dto';
import { ethers } from 'ethers';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private JwtService: JwtService,
    private config: ConfigService,
  ) {}

  async loginVerifyMessage(
    address: string,
    nonce: string,
    dto: LoginVerifyDto,
  ) {
    try {
      const verifiedAddress = await ethers.verifyMessage(
        this.message(address, nonce),
        dto.signature,
      );
      if (verifiedAddress.toLowerCase() === address.toLowerCase()) {
        console.log('Login pass');
        // create new jwt
      } else {
        throw new ForbiddenException('VerifyMessage Failed');
      }
    } catch (error) {
      throw new ForbiddenException('VerifyMessage Failed');
    }
  }

  private message(address: string, nonce: string) {
    return `Please sign this message for login in sphere exchange 
    address : ${address} nonce: ${nonce}`;
  }

  async getSignMessage(dto: GetMessageDto): Promise<ResultGetMessage> {
    const nonce = String(new Date().getTime());
    const token = await this.getJwtGetMessageTokens({
      address: dto.address,
      nonce,
    });
    const message = this.message(dto.address, nonce);
    return {
      message,
      getmessage_token: token,
    };
  }

  async getJwtGetMessageTokens(payload: JwtPayload) {
    const token = await this.JwtService.signAsync(
      {
        ...payload,
      },
      {
        secret: this.config.getOrThrow('GETMESSAGE_SECRET_TOKEN'),
        expiresIn: 60 * 10, // 10 min
      },
    );

    return token;
  }
}
