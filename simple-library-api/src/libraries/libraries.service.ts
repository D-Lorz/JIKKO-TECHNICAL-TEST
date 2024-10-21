import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { PrismaService } from '@/prisma.service';

@Injectable()
export class LibrariesService {
  constructor(private prisma: PrismaService) { }

  // Private helper method to check if a library exists
  private async checkLibraryExists(id: string) {
    const libraryFound = await this.prisma.library.findUnique({
      where: { id },
      include: {
        books: true, // Relation to books
      },
    });
    if (!libraryFound) {
      throw new NotFoundException(`Library with ID ${id} does not exist.`);
    }
    return libraryFound;
  }

  async getLibraries() {
    return await this.prisma.library.findMany({
      include: {
        books: { include: { borrowedBy: true } }, // Relation to books
      },
    });
  }

  async getLibrary(id: string) {
    return await this.checkLibraryExists(id);
  }

  async createLibrary(newLibrary: CreateLibraryDto) {
    let createdLibrary = null;
    try {
      // Create the library without books
      createdLibrary = await this.prisma.library.create({
        data: {
          name: newLibrary.name,
          location: newLibrary.location,
        },
      });
    } catch (error) {
      // Verify if the error is a duplicate key error
      if (error.code === 'P2002') { // Prisma error code for duplicate key
        throw new ConflictException(`The library with name ${newLibrary.name} already exists.`);
      }
      throw error;
    }
    
    // Validate books before creating them
    if (newLibrary.books && newLibrary.books.length > 0) {
      const bookCodes = new Set();
      for (const book of newLibrary.books) {
        // Check for duplicate book codes
        if (bookCodes.has(book.bookCode)) {
          throw new ConflictException(`Duplicate bookCode found: ${book.bookCode}`);
        }
        bookCodes.add(book.bookCode);

        // Check if the book already belongs to another library
        const existingBook = await this.prisma.book.findUnique({
          where: { bookCode: book.bookCode },
        });
        if (existingBook && existingBook.libraryId) {
          throw new ConflictException(`Book with bookCode ${book.bookCode} already belongs to another library.`);
        }
      }

      // Create books for the library
      try {
        await this.prisma.book.createMany({
          data: newLibrary.books.map(book => ({
            title: book.title,
            author: book.author,
            bookCode: book.bookCode,
            publishedDate: book.publishedDate,
            libraryId: createdLibrary.id,
          })),
        });
      } catch (error) {
        throw new Error(`Error creating books for library ${newLibrary.name}: ${error.message}`);
      }
    }

    return createdLibrary;
  }

  async updateLibrary(id: string, library: UpdateLibraryDto) {
    try {
      await this.checkLibraryExists(id);

      // Validate that books exist and are not assigned to another library
      if (library.books) {
        const bookIds = library.books.filter(book => typeof book === 'string');
        const existingBooks = await this.prisma.book.findMany({
          where: { id: { in: bookIds } },
        });

        const existingBookIds = new Set(existingBooks.map(book => book.id));
        for (const bookId of bookIds) {
          if (!existingBookIds.has(bookId)) {
            throw new NotFoundException(`Book with id ${bookId} does not exist.`);
          }
          const book = existingBooks.find(b => b.id === bookId);
          if (book.libraryId && book.libraryId !== id) {
            throw new ConflictException(`Book with id ${bookId} is already assigned to another library.`);
          }
        }
      }

      return await this.prisma.library.update({
        where: { id },
        data: {
          // Update all fields provided in the UpdateLibraryDto
          name: library.name,
          location: library.location,
          books: library.books && {
            // Connect books existing using their book id
            connect: library.books.filter(book => typeof book === 'string').map(bookId => ({ id: bookId })),
            // Upsert for a new books that don't exist yet
            upsert: library.books.filter(book => typeof book !== 'string').map(book => ({
              where: { id: book.bookCode },
              create: {
                title: book.title,
                author: book.author,
                bookCode: book.bookCode,
                publishedDate: book.publishedDate,
              },
              update: {
                title: book.title,
                author: book.author,
                publishedDate: book.publishedDate,
              },
            })),
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteLibrary(id: string) {
    try {
      await this.checkLibraryExists(id);
      return await this.prisma.library.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }
}
