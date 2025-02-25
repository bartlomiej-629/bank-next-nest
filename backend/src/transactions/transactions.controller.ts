import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('statement/:iban')
  async getAccountStatement(@Param('iban') iban: string) {
    try {
      const statement =
        await this.transactionsService.getAccountStatement(iban);
      return { success: true, statement };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
