import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { BookStatus as PrismaBookStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
    @ApiProperty({ description: 'The title of the book', example: 'The Great Gatsby' }) 
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'The author of the book', example: 'F. Scott Fitzgerald' })
    @IsString()
    @IsNotEmpty()
    author: string;

    @ApiProperty({ description: 'The bookCode (ISBN) of the book', example: 'TH-137' })
    @IsString()
    @IsNotEmpty()
    bookCode: string;
    
    @ApiProperty({ description: 'The description of the book', example: '2002-09-21T00:00:00.000Z' })
    @IsDateString()
    publishedDate: string;

    @ApiPropertyOptional({ description: 'The id of the library where the book is located', example: 'fb3fa0f3-b3ef-4555-b0cf-5dd3b3094016' })
    @IsOptional()
    @IsString()
    libraryId?: string;

    @ApiPropertyOptional({ description: 'The id of the member who borrowed the book' })
    @IsOptional()
    @IsString()
    borrowedById?: string;

    @ApiPropertyOptional({ description: 'The status of the book', enum: PrismaBookStatus, example: PrismaBookStatus.AVAILABLE })
    @IsOptional()
    @IsEnum(PrismaBookStatus)
    status?: PrismaBookStatus = PrismaBookStatus.AVAILABLE;
}
