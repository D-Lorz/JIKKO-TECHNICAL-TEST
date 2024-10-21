import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, NotFoundException, HttpStatus, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiTags } from '@nestjs/swagger';
import { BookStatus } from '@prisma/client';

@Controller('books')
@ApiTags('Books')
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  // Endpoint to retrieve all books
  @Get()
  getBooks() {
    return this.booksService.getBooks();
  }

  // Endpoint to retrieve a specific book by ID
  @Get(':id')
  @HttpCode(HttpStatus.OK) // Set HTTP status code to 200
  async getBook(@Param('id') id: string) {
    return await this.booksService.getBook(String(id));
  }

  // Endpoint to retrieve books by status
  @Get('status/:status')
  @HttpCode(HttpStatus.OK) // Set HTTP status code to 200
  async getBooksByStatus(@Param('status') status: string) {
    const bookStatus: BookStatus = status as BookStatus;
    return this.booksService.getBooksByStatus(bookStatus);
  }

  // Endpoint to create a new book
  @Post()
  @HttpCode(HttpStatus.CREATED) // Set HTTP status code to 201
  async createBook(@Body() newBook: CreateBookDto, @Body('libraryId') libraryId: string) {
    return await this.booksService.createBook(newBook, libraryId);
  }

  // Endpoint to update a book by ID
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateBook(@Param('id') id: string, @Body() bookData: UpdateBookDto) {
    return await this.booksService.updateBook(String(id), bookData);
  }

  // Endpoint to delete a book by ID
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Set HTTP status code to 204
  async deleteBook(@Param('id') id: string) {
    return await this.booksService.deleteBook(String(id));
    
  }
}
