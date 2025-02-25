import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { BadRequestException } from '@nestjs/common';

// Mock AccountsService
const mockAccountsService = {
  deposit: jest.fn(),
  withdraw: jest.fn(),
  transfer: jest.fn(),
  getAccountStatement: jest.fn(),
  getAllAccounts: jest.fn(),
};

describe('AccountsController', () => {
  let accountsController: AccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [{ provide: AccountsService, useValue: mockAccountsService }],
    }).compile();

    accountsController = module.get<AccountsController>(AccountsController);
  });

  describe('deposit', () => {
    it('should deposit an amount and return the new balance', async () => {
      const result = 1500;
      mockAccountsService.deposit.mockResolvedValue(result);

      const response = await accountsController.deposit({
        iban: 'DE1234567890',
        amount: 100,
      });
      expect(response).toEqual({ success: true, balance: result });
    });

    it('should throw BadRequestException when amount is less than or equal to zero', async () => {
      try {
        await accountsController.deposit({ iban: 'DE1234567890', amount: 0 });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Amount must be greater than zero');
      }
    });
  });

  describe('withdraw', () => {
    it('should withdraw an amount and return the new balance', async () => {
      const result = 900;
      mockAccountsService.withdraw.mockResolvedValue(result);

      const response = await accountsController.withdraw({
        iban: 'DE1234567890',
        amount: 100,
      });
      expect(response).toEqual({ success: true, balance: result });
    });

    it('should throw BadRequestException when amount is less than or equal to zero', async () => {
      try {
        await accountsController.withdraw({ iban: 'DE1234567890', amount: 0 });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Amount must be greater than zero');
      }
    });
  });

  describe('transfer', () => {
    it('should transfer an amount and return the new balance', async () => {
      const result = 1300;
      mockAccountsService.transfer.mockResolvedValue(result);

      const response = await accountsController.transfer({
        fromIban: 'DE1234567890',
        toIban: 'DE0987654321',
        amount: 100,
      });
      expect(response).toEqual({ success: true, balance: result });
    });

    it('should throw BadRequestException when amount is less than or equal to zero', async () => {
      try {
        await accountsController.transfer({
          fromIban: 'DE1234567890',
          toIban: 'DE0987654321',
          amount: 0,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Amount must be greater than zero');
      }
    });
  });

  describe('getAccountStatement', () => {
    it('should return account statement for the given iban', async () => {
      const statement = [
        {
          date: '2024-12-05',
          transaction: 'Deposit',
          amount: 100,
        },
      ];
      mockAccountsService.getAccountStatement.mockResolvedValue(statement);

      const response =
        await accountsController.getAccountStatement('DE1234567890');
      expect(response).toEqual({ success: true, statement });
    });

    it('should throw BadRequestException if service fails', async () => {
      mockAccountsService.getAccountStatement.mockRejectedValue(
        new Error('Account not found'),
      );

      try {
        await accountsController.getAccountStatement('DE1234567890');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Account not found');
      }
    });
  });

  describe('getAllAccounts', () => {
    it('should return a list of all accounts', async () => {
      const accounts = [
        { iban: 'DE1234567890', balance: 1000 },
        { iban: 'DE0987654321', balance: 2000 },
      ];
      mockAccountsService.getAllAccounts.mockResolvedValue(accounts);

      const response = await accountsController.getAllAccounts();
      expect(response).toEqual({ success: true, data: accounts });
    });

    it('should throw BadRequestException if service fails', async () => {
      mockAccountsService.getAllAccounts.mockRejectedValue(
        new Error('Failed to fetch accounts'),
      );

      try {
        await accountsController.getAllAccounts();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Failed to fetch accounts');
      }
    });
  });
});
