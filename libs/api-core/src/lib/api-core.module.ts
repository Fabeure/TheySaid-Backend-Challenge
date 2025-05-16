import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { GraphqlModule } from './graphql.module';

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [DatabaseModule, GraphqlModule],
})
export class ApiCoreModule { }
