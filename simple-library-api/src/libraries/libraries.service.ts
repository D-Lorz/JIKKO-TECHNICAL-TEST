import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { PrismaService } from '@/prisma.service';

@Injectable()
export class LibrariesService {
  constructor(private prisma: PrismaService) { }

  getLibraries() {
    return this.prisma.library.findMany({
      include: {
        books: true, // Relation to books
      },
    });
  }

  async getLibrary(id: string) {
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
    
    // Create books for the library
    if (newLibrary.books && newLibrary.books.length > 0) {
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
    // Attempt to update the library with the given ID
    const libraryUpdated = await this.prisma.library.update({
      where: { id },
      data: {
        // Update all fields provided in the UpdateLibraryDto
        name: library.name,
        location: library.location,
        books: library.books && {
          upsert: library.books.map(book => ({
            where: { bookCode: book.bookCode },
            create: {
              title: book.title,
              author: book.author,
              bookCode: book.bookCode,
              publishedDate: book.publishedDate,
            },
            update: {
              title: book.title,
              author: book.author,
              bookCode: book.bookCode,
              publishedDate: book.publishedDate,
            },
          })),
        },
      },
    });

    // If the library is not found, throw an exception
    if (!libraryUpdated) {
      throw new NotFoundException(`Library with ID ${id} does not exist.`);
    }
    return libraryUpdated;
  }

  deleteLibrary(id: string) {
    return this.prisma.library.delete({ where: { id } });
  }
}
