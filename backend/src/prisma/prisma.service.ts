import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    console.log('PrismaService initialized');
  }

  async onModuleDestroy() {
    console.log('PrismaService destroyed');
    await this.$disconnect();
  }
}
