import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookStatus } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) { }

  // Get all books from the database
  async getBooks() {
    return this.prisma.book.findMany({
      select: {
        id: true,
        title: true,
        author: true,
        bookCode: true,
        publishedDate: true,
        library: true,
        borrowedBy: true,
        status: true,
      },
    });
  }

  // Get a book by ID from the database
  async getBook(id: string) {
    const bookFound = await this.prisma.book.findUnique({ 
      where: { id },
      include: {
        library: true, // Relation to library
      },
    });

    // Throw an error if the book does not exist
    if (!bookFound) {
      throw new NotFoundException(`Book with ID ${id} does not exist.`);
    }

    return bookFound;
  }

  // Get books by status from the database
  async getBooksByStatus(status: BookStatus) {
    return this.prisma.book.findMany({
      where: { status },
      select: {
        id: true,
        title: true,
        author: true,
        bookCode: true,
        publishedDate: true,
        library: true,
        borrowedBy: true,
        status: true,
      },
    });
  }

  // Create a new book in the database
  async createBook(newBook: CreateBookDto, libraryId: string) {
    try {
      return await this.prisma.book.create({
        data: {
          title: newBook.title,
          author: newBook.author,
          bookCode: newBook.bookCode,
          publishedDate: newBook.publishedDate,
          status: newBook.status || BookStatus.AVAILABLE,
          ...(newBook.libraryId && {
            library: {
              connect: { id: newBook.libraryId },
            },
          }),
        },
      });
    } catch (error) {
      // Verify if the error is a duplicate key error
      if (error.code === 'P2002') { // Prisma error code for duplicate key
        throw new ConflictException(`The book with bookCode ${newBook.bookCode} already exists.`);
      }
      throw error;
    }
  }

  // Update a book in the database
  async updateBook(id: string, book: UpdateBookDto) {
    const bookFound = await this.prisma.book.update({
      where: { id },
      data: {
        ...book,
        // Update the status only if it is provided in the request body
        status: book.status ? { set: book.status as BookStatus } : undefined,
      },
    });

    // Throw an error if the book does not exist
    if (!bookFound) {
      throw new NotFoundException(`Book with ID ${id} does not exist.`);
    }

    return bookFound;
  }

  // Delete a book from the database
  async deleteBook(id: string) {
    return this.prisma.book.delete({ where: { id } });
  }
}
