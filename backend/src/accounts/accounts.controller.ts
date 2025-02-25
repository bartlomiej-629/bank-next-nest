import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Param,
} from '@nestjs/common';
import { AccountsService } from './accounts.service'; // Import AccountsService

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('deposit')
  async deposit(@Body() body: { iban: string; amount: number }) {
    const { iban, amount } = body;

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    try {
      const newBalance = await this.accountsService.deposit(iban, amount);
      return { success: true, balance: newBalance };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('withdraw')
  async withdraw(@Body() body: { iban: string; amount: number }) {
    const { iban, amount } = body;

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    try {
      const newBalance = await this.accountsService.withdraw(iban, amount);
      return { success: true, balance: newBalance };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('transfer')
  async transfer(
    @Body() body: { fromIban: string; toIban: string; amount: number },
  ) {
    const { fromIban, toIban, amount } = body;

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    try {
      const newBalance = await this.accountsService.transfer(
        fromIban,
        toIban,
        amount,
      );
      return { success: true, balance: newBalance };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Endpoint to get account statement
  @Get('statement/:iban')
  async getAccountStatement(@Param('iban') iban: string) {
    try {
      const statement = await this.accountsService.getAccountStatement(iban);
      return { success: true, statement };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // New route to get all accounts
  @Get('all')
  async getAllAccounts() {
    try {
      const accounts = await this.accountsService.getAllAccounts();
      return { success: true, data: accounts }; // Return the list of accounts
    } catch (error) {
      throw new BadRequestException('Failed to fetch accounts', error);
    }
  }
}
