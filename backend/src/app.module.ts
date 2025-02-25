import { Module, forwardRef } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [forwardRef(() => AccountsModule), TransactionsModule, PrismaModule],
  providers: [PrismaService],
  controllers: [],
})
export class AppModule {}
