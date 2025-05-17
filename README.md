# TheySaid - Blog Management System

A modern blog management system built with NestJS, GraphQL, and TypeORM. This application demonstrates a full-featured backend with GraphQL API, real-time subscriptions, and database integration.

## 🚀 Features

- **GraphQL API**: Full CRUD operations for blog posts
- **Real-time Updates**: GraphQL subscriptions for live blog updates
- **Database Integration**: PostgreSQL with TypeORM
- **Modern Stack**: NestJS, TypeScript, and Nx monorepo
- **Docker Support**: Containerized deployment ready
- **Type Safety**: Full TypeScript support with GraphQL type generation

## 🛠️ Technology Stack

- **Backend Framework**: NestJS v10
- **API Layer**: GraphQL with Apollo Server
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Build System**: Nx Workspace
- **Language**: TypeScript
- **Container**: Docker & Docker Compose
- **Testing**: Jest

## 📋 Prerequisites

To run this application, you'll need:

- Node.js (v18 or later)
- npm (v8 or later)
- PostgreSQL (v15 recommended)
- Docker and Docker Compose (for containerized deployment)

## 🔧 Local Development Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Set Up PostgreSQL**

   - Install PostgreSQL locally
   - Create a database named 'test'
   - Default credentials (can be modified in `libs/api-core/src/lib/database.module.ts`):
     ```
     username: postgres
     password: admin
     database: test
     ```

3. **Start the Development Server**

   ```bash
   npx nx serve TheySaid
   ```

4. **Access the Application**
   - API Endpoint: http://localhost:3000/api
   - GraphQL Playground: http://localhost:3000/api/graphql

## 🐳 Docker Deployment

### Option 1: Using Docker Compose (Recommended)

1. **Build the Application**

   ```bash
   docker build -t they-said:latest -f apps/TheySaid/Dockerfile .
   ```

2. **Start Services**

   ```bash
   docker-compose up -d
   ```

3. **Stop Services**
   ```bash
   docker-compose down
   ```

### Option 2: Manual Docker Setup

1. **Build the Image**

   ```bash
   docker build -t they-said:latest -f apps/TheySaid/Dockerfile .
   ```

2. **Run PostgreSQL Container**

   ```bash
   docker run -d \
     --name postgres \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=admin \
     -e POSTGRES_DB=test \
     -p 5432:5432 \
     postgres:15-alpine
   ```

3. **Run Application Container**
   ```bash
   docker run -d \
     --name they-said \
     -p 3000:3000 \
     -e POSTGRES_HOST=postgres \
     -e POSTGRES_PORT=5432 \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=admin \
     -e POSTGRES_DB=test \
     --link postgres \
     they-said:latest
   ```

## 📝 API Documentation

### GraphQL Schema

The API provides the following operations:

#### Queries

- `blogs(skip: Int, take: Int): [Blog!]!` - Get all blogs with pagination
- `blog(id: ID!): BlogResponse!` - Get a specific blog by ID

#### Mutations

- `createBlog(input: CreateBlogInput!): BlogResponse!` - Create a new blog
- `updateBlog(input: UpdateBlogInput!): BlogResponse!` - Update an existing blog
- `deleteBlog(id: ID!): BlogResponse!` - Delete a blog

#### Subscriptions

- `blogAdded: Blog!` - Real-time notifications for new blogs

### Data Models

```graphql
type Blog {
  id: ID!
  title: String!
  content: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

input CreateBlogInput {
  title: String!
  content: String!
}

input UpdateBlogInput {
  id: ID!
  title: String
  content: String
}
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npx nx test

# Run specific project tests
npx nx test TheySaid
```

### Test Coverage

```bash
npx nx test TheySaid --coverage
```

## 📁 Project Structure

```
.
├── apps/
│   ├── TheySaid/           # Main application
│   └── TheySaid-e2e/       # End-to-end tests
├── libs/
│   ├── api-core/           # Core functionality
│   ├── api-models/         # Shared models
│   └── api-blogs/          # Blog feature module
├── docker-compose.yml      # Docker composition
└── package.json           # Project dependencies
```

## 🔍 Monitoring & Debugging

### Logs

- **Docker Logs**

  ```bash
  # All services
  docker-compose logs -f

  # Specific service
  docker-compose logs -f app
  ```

- **Application Logs**
  ```bash
  # Development logs
  npx nx serve TheySaid
  ```

### Health Check

The application includes a basic health check endpoint at:
`http://localhost:3000/api`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**

   - Verify PostgreSQL is running
   - Check connection credentials
   - Ensure database exists

2. **Build Errors**

   - Clear Nx cache: `npx nx reset`
   - Reinstall dependencies: `npm ci`

3. **Docker Issues**
   - Ensure Docker daemon is running
   - Check container logs: `docker-compose logs`
   - Verify network connectivity between containers

### Getting Help

- Create an issue in the repository
- Check existing issues for solutions
- Review the documentation

## 🔄 Updates and Maintenance

### Updating Dependencies

```bash
# Check outdated packages
npm outdated

# Update packages
npm update
```

### Rebuilding the Application

```bash
# Clean build
npx nx reset
npx nx build TheySaid

# Docker rebuild
docker-compose down
docker build -t they-said:latest -f apps/TheySaid/Dockerfile .
docker-compose up -d
```
