import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TopicsModule } from './topics/topics.module';
import { TermsModule } from './terms/terms.module';

@Module({
  imports: [PrismaModule, TopicsModule, TermsModule],
})
export class AppModule {}
