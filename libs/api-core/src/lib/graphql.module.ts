import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true, // join(process.cwd(), 'libs/api-core/src/schema.gql'), FIXME this causes infinite rebuilds when schema already exists :(
            sortSchema: true,
            graphiql: true,
            subscriptions: {
                'graphql-ws': true,  // For modern clients
                'subscriptions-transport-ws': true  // Legacy support
              }
        }),
    ],
})
export class GraphqlModule { }


