import { Module } from '@nestjs/common';
import { BlogsResolver } from './blogs.resolver';

@Module({
  controllers: [],
  providers: [BlogsResolver],
  exports: [],
})
export class BlogsModule { }
