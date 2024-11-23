import { Module } from '@nestjs/common';
import { ProjectTaskController } from './project-task.controller';
import { ProjectTaskService } from './project-task.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectTaskController],
  providers: [ProjectTaskService, PrismaService],
  exports: [ProjectTaskService],
})
export class ProjectTaskModule {}
