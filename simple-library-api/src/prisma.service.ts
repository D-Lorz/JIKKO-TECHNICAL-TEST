import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// This service is responsible for managing the Prisma Client connection
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    // Connect to the database when the module starts
    async onModuleInit() {
        await this.$connect();
    }

    // Disconnect from the database when the module is stopped
    async onModuleDestroy() {
        await this.$disconnect();
    }
}
