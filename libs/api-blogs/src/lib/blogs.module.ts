import { Module } from '@nestjs/common';
import { BlogsResolver } from './blogs.resolver';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from '@myorg/api-models'
import { join } from 'path';

@Module({
  controllers: [],
  providers: [BlogsResolver],
  exports: [],
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'test',
      entities: [Blog],
      synchronize: true,
      autoLoadEntities: true,
    }),
  ]
})
export class BlogsModule { }
