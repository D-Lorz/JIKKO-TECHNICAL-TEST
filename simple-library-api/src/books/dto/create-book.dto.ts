import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { BookStatus as PrismaBookStatus } from '@prisma/client';

export class CreateBookDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    author: string;

    @IsString()
    @IsNotEmpty()
    bookCode: string;
    
    @IsDateString()
    publishedDate: string;

    @IsOptional()
    @IsString()
    libraryId?: string;

    @IsOptional()
    @IsString()
    borrowedById?: string;

    @IsOptional()
    @IsEnum(PrismaBookStatus)
    status?: PrismaBookStatus = PrismaBookStatus.AVAILABLE;
}
