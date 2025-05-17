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

- **Backend Framework**: NestJS
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

### Option 1: Using Pre-built Image from Docker Hub

1. **Pull and Run with Docker Compose**

   ```bash
   docker-compose up -d
   ```

   This will automatically pull the latest image from Docker Hub and start all services.

2. **Stop Services**
   ```bash
   docker-compose down
   ```

### Option 2: Building Locally

1. **Build the Application**

   ```bash
   docker build -t fabeure/blog-api:latest -f apps/TheySaid/Dockerfile .
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

- `blogs(skip: Int, take: Int): [Blog!]!` - Get all blogs with pagination (skip 0, take 10 by default)
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

You can test these operations in the GraphQL Playground at `http://localhost:3000/graphql`

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

```

```
