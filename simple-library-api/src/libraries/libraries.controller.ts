import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { LibrariesService } from './libraries.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('libraries')
@ApiTags('Libraries')
export class LibrariesController {
  constructor(private readonly librariesService: LibrariesService) { }

  // Endpoint to retrieve all libraries
  @Get()
  @HttpCode(HttpStatus.OK) // Set HTTP status code to 200
  getLibraries() {
    return this.librariesService.getLibraries();
  }

  // Endpoint to retrieve a specific library by ID
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getLibrary(@Param('id') id: string) {
    return this.librariesService.getLibrary(id);
  }

  // Endpoint to create new libraries
  @Post()
  @HttpCode(HttpStatus.CREATED) // Set HTTP status code to 201
  createLibrary(@Body() newLibraries: CreateLibraryDto) {
    return this.librariesService.createLibrary(newLibraries);
  }

  // Endpoint to update a library by ID
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateLibrary(@Param('id') id: string, @Body() library: UpdateLibraryDto) {
    return this.librariesService.updateLibrary(id, library);
  }

  // Endpoint to delete a library by ID
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Set HTTP status code to 204
  deleteLibrary(@Param('id') id: string) {
    return this.librariesService.deleteLibrary(id);
  }
}
