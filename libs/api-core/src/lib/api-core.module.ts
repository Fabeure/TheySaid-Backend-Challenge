import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { GraphqlModule } from './graphql.module';
import { PubSubService } from './pubsub.service';

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [DatabaseModule, GraphqlModule, PubSubService],
})
export class ApiCoreModule { }
