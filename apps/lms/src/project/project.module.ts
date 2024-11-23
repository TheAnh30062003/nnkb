import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProjectTaskController } from './project-task/project-task.controller';
import { ProjectTaskService } from './project-task/project-task.service';
import { ProjectTaskModule } from './project-task/project-task.module';

@Module({
  imports: [PrismaModule, ProjectTaskModule], // Nhập PrismaModule
  providers: [ProjectService, ProjectTaskService],
  controllers: [ProjectController, ProjectTaskController],
})
export class ProjectModule {}
