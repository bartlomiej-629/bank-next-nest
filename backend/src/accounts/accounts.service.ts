import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// IBAN validation regex (simple version, can be extended)
const IBAN_REGEX = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async deposit(iban: string, amount: number) {
    let account = await this.prisma.account.findUnique({ where: { iban } });
    if (!account) {
      // Create a new account if it doesn't exist
      account = await this.prisma.account.create({
        data: {
          iban,
          balance: 0,
        },
      });
    }

    const newBalance = account.balance + amount;

    // Update account balance
    await this.prisma.account.update({
      where: { iban },
      data: { balance: newBalance },
    });

    // Record the deposit transaction
    await this.prisma.transaction.create({
      data: {
        accountId: account.id,
        type: 'deposit',
        amount,
        balance: newBalance,
      },
    });

    return newBalance;
  }

  async withdraw(iban: string, amount: number) {
    const account = await this.prisma.account.findUnique({ where: { iban } });
    if (!account) {
      throw new Error('Account not found');
    }

    if (account.balance < amount) {
      throw new Error('Insufficient balance');
    }

    const newBalance = account.balance - amount;

    // Update account balance
    await this.prisma.account.update({
      where: { iban },
      data: { balance: newBalance },
    });

    // Record the withdrawal transaction
    await this.prisma.transaction.create({
      data: {
        accountId: account.id,
        type: 'withdrawal',
        amount,
        balance: newBalance,
      },
    });

    return newBalance;
  }

  async transfer(fromIban: string, toIban: string, amount: number) {
    // Validate IBAN format
    if (!IBAN_REGEX.test(toIban)) {
      throw new Error('Invalid IBAN format');
    }

    const fromAccount = await this.prisma.account.findUnique({
      where: { iban: fromIban },
    });
    const toAccount = await this.prisma.account.findUnique({
      where: { iban: toIban },
    });

    if (!fromAccount || !toAccount) {
      throw new Error('One or both accounts not found');
    }

    if (fromAccount.balance < amount) {
      throw new Error('Insufficient balance');
    }

    const newFromBalance = fromAccount.balance - amount;
    const newToBalance = toAccount.balance + amount;

    // Update both account balances
    await this.prisma.account.update({
      where: { iban: fromIban },
      data: { balance: newFromBalance },
    });

    await this.prisma.account.update({
      where: { iban: toIban },
      data: { balance: newToBalance },
    });

    // Record the transaction for both accounts
    await this.prisma.transaction.create({
      data: {
        accountId: fromAccount.id,
        type: 'transfer_out',
        amount,
        balance: newFromBalance,
      },
    });

    await this.prisma.transaction.create({
      data: {
        accountId: toAccount.id,
        type: 'transfer_in',
        amount,
        balance: newToBalance,
      },
    });

    return newFromBalance; // Optionally return both balances if needed
  }

  // Get account statement: Return a list of transactions for an account
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

  // Get All accounts : Return a list of accounts
  async getAllAccounts() {
    return this.prisma.account.findMany();
  }
}
