import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { format, parse, isValid } from 'date-fns';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Hàm để chuyển đổi từ DateTime sang định dạng dd/MM/yyyy
  formatDueDate(date: Date): string {
    return format(date, 'dd/MM/yyyy');
  }

  // Hàm để chuyển đổi từ định dạng dd/MM/yyyy sang DateTime
  parseDueDate(dateString: string): Date | null {
    const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
    return isValid(parsedDate) ? parsedDate : null; // Trả về null nếu ngày không hợp lệ
    
  }
  
}
