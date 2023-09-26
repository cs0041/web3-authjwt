import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetMessageDto } from './dto';
import { JwtPayload, TokenGetMessage, Tokens } from './types';
import { ConfigService } from '@nestjs/config';
import { LoginVerifyDto } from './dto';
import { N, ethers } from 'ethers';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private JwtService: JwtService,
    private config: ConfigService,
  ) {}

  async loginVerifyMessage(
    userAddress: string,
    nonce: string,
    dto: LoginVerifyDto,
  ): Promise<Tokens> {
    let verifiedAddress: string;
    try {
      // verifyMessage eth
      verifiedAddress = ethers.verifyMessage(
        this.message(userAddress, nonce),
        dto.signature,
      );
    } catch (error) {
      throw new ForbiddenException('VerifyMessage Failed');
    }

    // check  login verifiedAddress

    // login pass
    if (verifiedAddress.toLowerCase() === userAddress.toLowerCase()) {
      console.log('Login pass');
      // find user
      const user = await this.prisma.user.findUnique({
        where: {
          address: userAddress,
        },
      });
      // if new user create it
      if (!user) {
        const newUser = await this.prisma.user.create({
          data: {
            address: userAddress,
          },
        });
      }

      // jwt token
      const tokens = await this.getJwtAccessAndRefreshTokens({
        address: userAddress,
        nonce: this.getNonce(),
      });

      await this.updateRtHash(userAddress, tokens.refresh_token);

      return tokens;
    } else {
      // login failed
      throw new ForbiddenException('Login Failed');
    }
  }

  async getSignMessage(dto: GetMessageDto): Promise<TokenGetMessage> {
    const nonce = this.getNonce();
    console.log('address', dto.address);
    console.log('nonce', nonce);
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

  async getRefreshTokens(userAddress: string, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        address: userAddress,
      },
    });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.hashedRt, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getJwtAccessAndRefreshTokens({
      address: userAddress,
      nonce: this.getNonce(),
    });
    await this.updateRtHash(userAddress, tokens.refresh_token);

    return tokens;
  }

  async logout(userAddress: string) {
    await this.prisma.user.updateMany({
      where: {
        address: userAddress,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  private message(address: string, nonce: string) {
    return `Please sign this message for login in sphere exchange 
    address : ${address} nonce: ${nonce}`;
  }

  private async updateRtHash(userAddress: string, rt: string) {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        address: userAddress,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  private getNonce() {
    return String(new Date().getTime());
  }

  private async getJwtGetMessageTokens(payload: JwtPayload) {
    const token = await this.JwtService.signAsync(
      {
        ...payload,
      },
      {
        secret: this.config.getOrThrow('GETMESSAGE_SECRET_TOKEN'),
        expiresIn: 60 * 15, // 15 min
      },
    );

    return token;
  }

  private async getJwtAccessAndRefreshTokens(
    payload: JwtPayload,
  ): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.JwtService.signAsync(
        {
          ...payload,
        },
        {
          secret: this.config.getOrThrow('ACCESS_SECRET_TOKEN'),
          expiresIn: 60 * 15, // 15 min
        },
      ),
      this.JwtService.signAsync(
        {
          ...payload,
        },
        {
          secret: this.config.getOrThrow('REFRESH_SECRET_TOKEN'),
          expiresIn: 60 * 60 * 24 * 7, // 7 day
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
