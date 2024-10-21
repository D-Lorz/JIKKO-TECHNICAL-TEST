import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookStatus } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) { }

  // Private helper method to check if a book exists
  private async checkBookExists(id: string) {
    const bookFound = await this.prisma.book.findUnique({ 
      where: { id },
      include: {
        library: true, // Relation to library
        borrowedBy: true, // Relation to member
      },
    });
    if (!bookFound) {
      throw new NotFoundException(`Book with ID ${id} does not exist.`);
    }
    return bookFound;
  }

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
    return await this.checkBookExists(id);
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
    try {
      const existingBook = await this.checkBookExists(id);

      // Validate if the book is available before updating it

      if (book.borrowedById) {
        // Only available books can be borrowed
        if (existingBook.status === BookStatus.AVAILABLE) {
          return await this.prisma.book.update({
            where: { id },
            data: {
              borrowedBy: { connect: { id: book.borrowedById } },
              status: BookStatus.BORROWED,
            },
          });
        } else {
          throw new ConflictException(`The book is not available for borrowing.`);
        }
      }

      return await this.prisma.book.update({
        where: { id },
        data: {
          ...book,
          // Update the status only if it is provided in the request body
          status: existingBook.status === BookStatus.BORROWED ? existingBook.status : book.status ? { set: book.status as BookStatus } : undefined,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Delete a book from the database
  async deleteBook(id: string) {
    try {
      await this.checkBookExists(id); // Check if the book exists
      return await this.prisma.book.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }
}
