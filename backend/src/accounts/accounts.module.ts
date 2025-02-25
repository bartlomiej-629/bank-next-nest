import { Module, forwardRef } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { AppModule } from '../app.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [forwardRef(() => AppModule), PrismaModule],
  providers: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule {}
