import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('members')
@ApiTags('Members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  // Endpoint to retrieve all members
  @Get()
  @HttpCode(HttpStatus.OK) // Indicates that the request was successful
  getMembers() {
    return this.membersService.getMembers();
  }

  // Endpoint to retrieve a specific member by ID
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getMember(@Param('id') id: string) {
    return this.membersService.getMember(id);
  }

  // Endpoint to create a new member
  @Post()
  @HttpCode(HttpStatus.CREATED) // Indicates that a new member is created
  create(@Body() newMember: CreateMemberDto) {
    return this.membersService.createMember(newMember);
  }

  // Endpoint to update a member by ID
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateMember(@Param('id') id: string, @Body() member: UpdateMemberDto) {
    return this.membersService.updateMember(id, member);
  }

  // Endpoint to delete a member by ID
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Indicates that the member was deleted successfully
  deleteMember(@Param('id') id: string) {
    return this.membersService.deleteMember(id);
  }
}
