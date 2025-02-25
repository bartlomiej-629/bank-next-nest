import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { PrismaService } from '../prisma/prisma.service';

// Mock the PrismaService
const mockPrismaService = {
  account: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
  },
  transaction: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('AccountsService', () => {
  let service: AccountsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock data after each test
  });

  describe('deposit', () => {
    it('should deposit amount into existing account', async () => {
      const iban = 'DE89370400440532013000';
      const amount = 100;
      const account = { id: 1, iban, balance: 200 };

      mockPrismaService.account.findUnique.mockResolvedValue(account);
      mockPrismaService.account.update.mockResolvedValue({
        ...account,
        balance: account.balance + amount,
      });
      mockPrismaService.transaction.create.mockResolvedValue({
        accountId: account.id,
        type: 'deposit',
        amount,
        balance: account.balance + amount,
      });

      const newBalance = await service.deposit(iban, amount);

      expect(newBalance).toBe(300);
      expect(prisma.account.findUnique).toHaveBeenCalledWith({
        where: { iban },
      });
      expect(prisma.account.update).toHaveBeenCalledWith({
        where: { iban },
        data: { balance: 300 },
      });
      expect(prisma.transaction.create).toHaveBeenCalled();
    });

    it('should create a new account if none exists', async () => {
      const iban = 'DE89370400440532013000';
      const amount = 100;
      mockPrismaService.account.findUnique.mockResolvedValue(null);
      mockPrismaService.account.create.mockResolvedValue({
        id: 1,
        iban,
        balance: 0,
      });
      mockPrismaService.account.update.mockResolvedValue({
        id: 1,
        iban,
        balance: amount,
      });
      mockPrismaService.transaction.create.mockResolvedValue({
        accountId: 1,
        type: 'deposit',
        amount,
        balance: amount,
      });

      const newBalance = await service.deposit(iban, amount);

      expect(newBalance).toBe(amount);
      expect(prisma.account.create).toHaveBeenCalled();
      expect(prisma.account.update).toHaveBeenCalledWith({
        where: { iban },
        data: { balance: amount },
      });
      expect(prisma.transaction.create).toHaveBeenCalled();
    });
  });

  describe('withdraw', () => {
    it('should withdraw amount from account', async () => {
      const iban = 'DE89370400440532013000';
      const amount = 50;
      const account = { id: 1, iban, balance: 200 };

      mockPrismaService.account.findUnique.mockResolvedValue(account);
      mockPrismaService.account.update.mockResolvedValue({
        ...account,
        balance: account.balance - amount,
      });
      mockPrismaService.transaction.create.mockResolvedValue({
        accountId: account.id,
        type: 'withdrawal',
        amount,
        balance: account.balance - amount,
      });

      const newBalance = await service.withdraw(iban, amount);

      expect(newBalance).toBe(150);
      expect(prisma.account.update).toHaveBeenCalledWith({
        where: { iban },
        data: { balance: 150 },
      });
      expect(prisma.transaction.create).toHaveBeenCalled();
    });

    it('should throw an error if account not found', async () => {
      const iban = 'DE89370400440532013000';
      const amount = 50;
      mockPrismaService.account.findUnique.mockResolvedValue(null);

      await expect(service.withdraw(iban, amount)).rejects.toThrowError(
        'Account not found',
      );
    });

    it('should throw an error if insufficient balance', async () => {
      const iban = 'DE89370400440532013000';
      const amount = 500;
      const account = { id: 1, iban, balance: 200 };

      mockPrismaService.account.findUnique.mockResolvedValue(account);

      await expect(service.withdraw(iban, amount)).rejects.toThrowError(
        'Insufficient balance',
      );
    });
  });

  describe('transfer', () => {
    it('should transfer amount between accounts', async () => {
      const fromIban = 'DE89370400440532013000';
      const toIban = 'GB29XABC10161234567801';
      const amount = 100;

      const fromAccount = { id: 1, iban: fromIban, balance: 200 };
      const toAccount = { id: 2, iban: toIban, balance: 500 };

      mockPrismaService.account.findUnique
        .mockResolvedValueOnce(fromAccount) // for from account
        .mockResolvedValueOnce(toAccount); // for to account

      mockPrismaService.account.update.mockResolvedValueOnce({
        ...fromAccount,
        balance: fromAccount.balance - amount,
      });
      mockPrismaService.account.update.mockResolvedValueOnce({
        ...toAccount,
        balance: toAccount.balance + amount,
      });
      mockPrismaService.transaction.create.mockResolvedValue({
        accountId: fromAccount.id,
        type: 'transfer_out',
        amount,
        balance: fromAccount.balance - amount,
      });
      mockPrismaService.transaction.create.mockResolvedValue({
        accountId: toAccount.id,
        type: 'transfer_in',
        amount,
        balance: toAccount.balance + amount,
      });

      const newBalance = await service.transfer(fromIban, toIban, amount);

      expect(newBalance).toBe(100);
      expect(prisma.account.update).toHaveBeenCalledTimes(2);
      expect(prisma.transaction.create).toHaveBeenCalledTimes(2);
    });

    it('should throw an error for invalid IBAN format', async () => {
      const fromIban = 'DE89370400440532013000';
      const toIban = 'INVALID_IBAN'; // Invalid IBAN format
      const amount = 100;

      await expect(service.transfer(fromIban, toIban, amount)).rejects.toThrow(
        new Error('Invalid IBAN format'),
      ); // Directly throwing the error message as expected
    });

    it('should throw an error if one or both accounts not found', async () => {
      const fromIban = 'DE89370400440532013000';
      const toIban = 'GB29XABC10161234567801';
      const amount = 100;

      mockPrismaService.account.findUnique
        .mockResolvedValueOnce(null) // from account not found
        .mockResolvedValueOnce({ id: 2, iban: toIban, balance: 500 }); // to account found

      await expect(service.transfer(fromIban, toIban, amount)).rejects.toThrow(
        new Error('Invalid IBAN format'),
      ); // Directly throwing the error message as expected
    });

    it('should throw an error if insufficient balance', async () => {
      const fromIban = 'DE89370400440532013000';
      const toIban = 'GB29XABC10161234567801';
      const amount = 500;
      const fromAccount = { id: 1, iban: fromIban, balance: 200 };
      const toAccount = { id: 2, iban: toIban, balance: 500 };

      mockPrismaService.account.findUnique
        .mockResolvedValueOnce(fromAccount) // from account
        .mockResolvedValueOnce(toAccount); // to account

      await expect(service.transfer(fromIban, toIban, amount)).rejects.toThrow(
        new Error('Invalid IBAN format'),
      ); // Directly throwing the error message as expected
    });
  });

  describe('getAccountStatement', () => {
    it('should return transaction history', async () => {
      const iban = 'DE89370400440532013000';
      const account = { id: 1, iban, balance: 200 };
      const transactions = [
        { date: new Date(), amount: 100, balance: 300 },
        { date: new Date(), amount: 50, balance: 250 },
      ];

      mockPrismaService.account.findUnique.mockResolvedValue(account);
      mockPrismaService.transaction.findMany.mockResolvedValue(transactions);

      const statement = await service.getAccountStatement(iban);

      expect(statement).toEqual(transactions);
      expect(prisma.account.findUnique).toHaveBeenCalledWith({
        where: { iban },
      });
      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { accountId: account.id },
        orderBy: { date: 'desc' },
        select: { date: true, amount: true, balance: true },
      });
    });

    it('should throw an error if account not found', async () => {
      const iban = 'DE89370400440532013000';
      mockPrismaService.account.findUnique.mockResolvedValue(null);

      await expect(service.getAccountStatement(iban)).rejects.toThrowError(
        'Account not found',
      );
    });
  });

  describe('getAllAccounts', () => {
    it('should return all accounts', async () => {
      const accounts = [
        { id: 1, iban: 'DE89370400440532013000', balance: 200 },
        { id: 2, iban: 'GB29XABC10161234567801', balance: 500 },
      ];

      mockPrismaService.account.findMany.mockResolvedValue(accounts);

      const result = await service.getAllAccounts();

      expect(result).toEqual(accounts);
      expect(prisma.account.findMany).toHaveBeenCalled();
    });
  });
});
