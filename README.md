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
   - GraphQL Playground: http://localhost:3000/graphql

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

### Sample GraphQL Operations

You can test these operations in the GraphQL Playground at `http://localhost:3000/api/graphql`

#### Query Examples

```graphql
# Get all blogs with pagination
query GetAllBlogs {
  blogs(skip: 0, take: 10) {
    id
    title
    content
    createdAt
    updatedAt
  }
}

# Get a specific blog by ID
query GetBlog {
  blog(id: "your-blog-id") {
    ... on Blog {
      id
      title
      content
      createdAt
      updatedAt
    }
    ... on BlogNotFoundError {
      message
      code
      blogId
    }
  }
}
```

#### Mutation Examples

```graphql
# Create a new blog
mutation CreateBlog {
  createBlog(input: { title: "My First Blog", content: "This is the content of my first blog post." }) {
    ... on Blog {
      id
      title
      content
      createdAt
    }
    ... on BlogTitleExistsError {
      message
      code
      title
    }
  }
}

# Update an existing blog
mutation UpdateBlog {
  updateBlog(input: { id: "your-blog-id", title: "Updated Title", content: "Updated content for my blog post." }) {
    ... on Blog {
      id
      title
      content
      updatedAt
    }
    ... on BlogNotFoundError {
      message
      code
      blogId
    }
  }
}

# Delete a blog
mutation DeleteBlog {
  deleteBlog(id: "your-blog-id") {
    ... on Blog {
      id
      title
    }
    ... on BlogNotFoundError {
      message
      code
      blogId
    }
  }
}
```

#### Subscription Example

```graphql
# Subscribe to new blog posts
subscription OnBlogAdded {
  blogAdded {
    id
    title
    content
    createdAt
  }
}
```

#### Using Variables

You can also use variables in your queries/mutations. Here's an example:

```graphql
# Query with variables
query GetBlog($id: ID!) {
  blog(id: $id) {
    ... on Blog {
      id
      title
      content
    }
  }
}

# Variables in JSON format
{
  "id": "your-blog-id"
}
```

### Error Handling

The API uses union types for error handling. Possible errors include:

```graphql
type BlogNotFoundError {
  message: String!
  code: String!
  blogId: String!
}

type BlogTitleExistsError {
  message: String!
  code: String!
  title: String!
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
