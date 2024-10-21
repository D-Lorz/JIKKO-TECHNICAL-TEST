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
    membershipCode: string;

    @ApiPropertyOptional({ description: 'An array of borrowed book IDs', example: ["a591b812-9762-4e14-877b-4b59e62a0d91", "b4b0f166-8817-4166-981b-408754467086"] })
    @IsOptional()
    @IsArray()
    borrowedBooks?: string[];
}
