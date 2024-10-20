import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMemberDto {
    @ApiProperty({ description: 'The first name of the member', example: 'John' })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ description: 'The last name of the member', example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ description: 'The email of the member', example: 'john.doe@example.com' })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'The unique member ID', example: 'RS-8217' })
    @IsString()
    @IsNotEmpty()
    memberId: string;

    @ApiPropertyOptional({ description: 'An array of borrowed book IDs' })
    @IsOptional()
    @IsArray()
    borrowedBooks?: string[];
}
