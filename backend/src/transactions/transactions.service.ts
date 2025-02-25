import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAccountStatement(iban: string) {
    const account = await this.prisma.account.findUnique({ where: { iban } });

    if (!account) {
      throw new Error('Account not found');
    }

    return this.prisma.transaction.findMany({
      where: { accountId: account.id },
      orderBy: { date: 'desc' }, // Sort by date (most recent first)
      select: {
        date: true,
        amount: true,
        balance: true,
      },
    });
  }
}
