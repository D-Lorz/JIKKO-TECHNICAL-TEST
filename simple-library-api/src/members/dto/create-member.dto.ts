import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateMemberDto { 
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    memberId: string;

    @IsOptional()
    @IsArray()
    borrowedBooks?: string[];
}
