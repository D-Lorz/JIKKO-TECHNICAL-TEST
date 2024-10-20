# Simple Library API

## Description
This is a simple Library Management System designed to manage books, libraries, and members. 
The system allows users to perform CRUD (Create, Read, Update, Delete) operations on the following entities:

  - **Books**: Manage book details, including title, author, book code, publication date, and availability status.
  - **Libraries**: Manage library information, including name, location, and list of books available in the library.
  - **Members**: Manage member information, including name, membership ID, email, and borrowed books.

  The API provides endpoints for:
  - Adding new books, libraries, and members.
  - Retrieving details of existing books, libraries, and members.
  - Updating information for books, libraries, and members.
  - Deleting books, libraries, and members from the system.

  The system aims to simplify the management of library resources and enhance user experience in accessing and managing books.


## Installation and Setup

```bash
$ npm install
```

### Required environment variables:

These variables are essential for the application's configuration and should be defined in a .development.env file in the root directory of the project.

- `DB_USER`: Username for database connection set to PostgreSQL.
- `DB_PASSWORD`: Password for the database user.
- `DB_HOST`: Host address for the database (example: localhost).
- `DB_PORT`: Port for database connections.
- `DB_NAME`: Name of the database set to PostgreSQL
- `PORT_APP`: Port for the application.
- `DATABASE_URL`: Connection string for the database, combining the above variables for easy connection.

The application uses the NEON (PostgreSQL) database and runs on port 8000.

> ### Example .env file:
> ```.env
> DB_USER=
> DB_PASSWORD=
> DB_HOST=
> DB_NAME=
> PORT_APP=8000
> DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}
> ```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Endpoints

### Swagger
- **GET /api/**: Access the API documentation through Swagger.

### Books
- **GET /api/v1/books**: Retrieve a list of all books.
- **GET /api/v1/books/:id**: Retrieve details of a specific book by ID.
- **GET /api/v1/status**: Retrieve the availability status of a book by ID. (AVAILABLE or BORROWED)
- **POST /api/v1/books**: Create a new book.
- **PUT /api/v1/books/:id**: Update an existing book by ID.
- **DELETE /api/v1/books/:id**: Delete a book by ID.

### Libraries
- **GET /api/v1/libraries**: Retrieve a list of all libraries.
- **GET /api/v1/libraries/:id**: Retrieve details of a specific library by ID.
- **POST /api/v1/libraries**: Create a new library.
- **PUT /api/v1/libraries/:id**: Update an existing library by ID.
- **DELETE /api/v1/libraries/:id**: Delete a library by ID.

### Members
- **GET /api/v1/members**: Retrieve a list of all members.
- **GET /api/v1/members/:id**: Retrieve details of a specific member by ID.
- **POST /api/v1/members**: Create a new member.
- **PUT /api/v1/members/:id**: Update an existing member by ID.
- **DELETE /api/v1/members/:id**: Delete a member by ID.

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Prisma**: A next-generation ORM that helps in querying the database in a type-safe manner.
- **PostgreSQL (NEON Online)**: A powerful, open-source relational database management system.
- **TypeScript**: A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
- **Swagger**: Used for API documentation, providing a user-friendly interface to explore and test the API endpoints.
- **Morgan**: HTTP request logger middleware for Node.js, used for logging requests in development mode.
- **Class-validator**: A library for validating objects in TypeScript, used for validating incoming request data.
- **CORS**: Configured to allow cross-origin requests, ensuring the API can be accessed from different domains.


## Author

- [Dorian López](https://www.linkedin.com/in/dorian-lorz/)

## License

Nest is [MIT licensed](LICENSE).
