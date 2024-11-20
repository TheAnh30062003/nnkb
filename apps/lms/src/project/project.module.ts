import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Nhập PrismaModule
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
