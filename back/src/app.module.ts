import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { ChatGateway } from './chat/chat.gateway';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [TasksModule],
  providers: [ChatGateway, PrismaService],
})
export class AppModule {}