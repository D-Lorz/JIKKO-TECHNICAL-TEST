import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { LibrariesModule } from './libraries/libraries.module';
import { MembersModule } from './members/members.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }), 
    BooksModule, LibrariesModule, MembersModule]
})
export class AppModule {}
