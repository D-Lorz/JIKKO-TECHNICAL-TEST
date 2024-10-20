import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan';
import { CORS } from '@/constants/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use morgan for logging HTTP requests in development mode
  app.use(morgan('dev'));

  const configService = app.get(ConfigService);

  // Enable global validation pipe to automatically validate incoming requests
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true, // Only validate properties that are defined in the DTOs
    forbidNonWhitelisted: true, // Return an error if there are properties not allowed
    skipMissingProperties: false
  }));

  // Set a global prefix for all routes
  app.setGlobalPrefix('api');

  // Enable versioning for the API
  app.enableVersioning({
    type: VersioningType.URI, // Example: /api/v1/books
    defaultVersion: '1', // Default version is 1
  });

  // Configure Swagger for API documentation
  const config = new DocumentBuilder()
    .setTitle('Library API')
    .setDescription(`This is a simple Library Management System designed to manage books, libraries, and members. 
  The system allows users to perform CRUD (Create, Read, Update, Delete) operations on the following entities:

  - **Books**: Manage book details, including title, author, book code, publication date, and availability status.
  - **Libraries**: Manage library information, including name, location, and list of books available in the library.
  - **Members**: Manage member information, including name, membership ID, email, and borrowed books.

  The API provides endpoints for:
  - Adding new books, libraries, and members.
  - Retrieving details of existing books, libraries, and members.
  - Updating information for books, libraries, and members.
  - Deleting books, libraries, and members from the system.

  The system aims to simplify the management of library resources and enhance user experience in accessing and managing books.`)
    .setVersion('1.0')
    .build();

  // Create Swagger document and set up the Swagger UI
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Enable CORS with predefined settings
  app.enableCors(CORS);

  // Start the application and listen on the specified port
  await app.listen(configService.get('PORT') || 4000);
  console.log(`\nApplication running on: ${await app.getUrl()}`);
}

// Call the bootstrap function to start the application
bootstrap();
