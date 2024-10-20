import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { CreateBookDto as booksDto } from '@/books/dto/create-book.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLibraryDto {
    @ApiProperty({ description: 'The name of the library', example: 'Central Library' }) 
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'The location of the library', example: '123 Main St, Springfield' })
    @IsString()
    @IsNotEmpty()
    location: string;

    @ApiPropertyOptional({ description: 'An array of books in the library', example: [{ title: '1984', author: 'George Orwell' }] })
    @IsArray()
    @IsOptional()
    books?: booksDto[];
}
