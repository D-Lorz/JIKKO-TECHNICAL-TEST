import { ConflictException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { PrismaService } from '@/prisma.service';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) { }

  // Get all members from the database
  getMembers() {
    return this.prisma.member.findMany({
      include: {
        borrowedBooks: true,
      }
    });
  }

  // Get a member by ID from the database
  getMember(id: string) {
    return this.prisma.member.findUnique({
      where: { id },
      include: {
        borrowedBooks: true,
      }
    });
  }

  // Create a new member in the database
  async createMember(newMember: CreateMemberDto) {
    try {
      return await this.prisma.member.create({
        data: {
          ...newMember,
          borrowedBooks: undefined,
        },
      });
    } catch (error) {
      // Verify if the error is a duplicate key error
      if (error.code === 'P2002') { // Prisma error code for duplicate key
        throw new ConflictException(`The member with ID ${newMember.memberId} already exists.`);
      }
      throw error;
    }
  }

  async updateMember(memberId: string, updateData: Partial<UpdateMemberDto>): Promise<UpdateMemberDto> {
    const { borrowedBooks, ...otherData } = updateData;

    // Prepare data to update
    const dataToUpdate: any = { ...otherData };

    // If borrowedBooks is provided, check their status before updating
    if (borrowedBooks && borrowedBooks.length > 0) {
      // Check if any of the borrowedBooks are already borrowed
      const borrowedBooksStatus = await this.prisma.book.findMany({
        where: { id: { in: borrowedBooks } },
        select: { id: true, status: true },
      });

      const alreadyBorrowed = borrowedBooksStatus.filter(book => book.status === 'BORROWED');
      if (alreadyBorrowed.length > 0) {
        throw new ConflictException(`The following books are already borrowed: ${alreadyBorrowed.map(book => book.id).join(', ')}`);
      }

      // Check if borrowedBooks exist in the library
      const existingBooks = await this.prisma.book.findMany({
        where: {
          id: { in: borrowedBooks },
          status: 'AVAILABLE',
          libraryId: { not: null }
        },
        select: { id: true },
      });

      const nonExistentBooks = borrowedBooks.filter(id => !existingBooks.some(book => book.id === id));
      if (nonExistentBooks.length > 0) {
        throw new ConflictException(`The following books do not exist in the library: ${nonExistentBooks.join(', ')}`);
      }

      // Get current borrowed books of the member
      const currentMember = await this.prisma.member.findUnique({
        where: { id: memberId },
        select: { borrowedBooks: true },
      });

      // Combine current borrowed books with new ones
      const allBorrowedBooks = [...new Set([...currentMember.borrowedBooks.map(b => b.id), ...borrowedBooks])];

      dataToUpdate.borrowedBooks = {
        set: allBorrowedBooks.map((id) => ({ id })),
      };

      // Change the status of the new borrowed books
      await Promise.all(borrowedBooks.map(async (id) => {
        await this.prisma.book.update({
          where: { id },
          data: { status: 'BORROWED' },
        });
      }));
    }

    // Update the member in the database
    return this.prisma.member.update({
      where: { id: memberId },
      data: dataToUpdate,
    });
  }

  async deleteMember(id: string) {
    // Get the borrowed books of the member
    const member = await this.prisma.member.findUnique({
      where: { id },
      select: { borrowedBooks: true },
    });

    // If the member has borrowed books, update their status to available
    if (member && member.borrowedBooks) {
      await Promise.all(member.borrowedBooks.map(async (book) => {
        await this.prisma.book.update({
          where: { id: book.id },
          data: { status: 'AVAILABLE' }, // Change status to available
        });
      }));
    }

    // Delete the member
    return this.prisma.member.delete({ where: { id } });
  }
}
