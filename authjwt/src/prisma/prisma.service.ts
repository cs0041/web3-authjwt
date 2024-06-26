import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.getOrThrow('DATABASE_URL'),
        },
      },
    });
  }

  // cleanDb() {
  //   return this.$transaction([
  //     this.expense.deleteMany(),
  //     this.user.deleteMany(),
  //   ]);
  // }
}
