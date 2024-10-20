import { Module } from '@nestjs/common';
import { LibrariesService } from './libraries.service';
import { LibrariesController } from './libraries.controller';
import { PrismaService } from '@/prisma.service';

@Module({
  controllers: [LibrariesController],
  providers: [LibrariesService, PrismaService],
})
export class LibrariesModule {}
