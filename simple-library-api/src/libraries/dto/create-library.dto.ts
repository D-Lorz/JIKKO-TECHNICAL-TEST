import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { CreateBookDto as booksDto } from '@/books/dto/create-book.dto';

export class CreateLibraryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsArray()
    @IsOptional()
    books?: booksDto[];
}
