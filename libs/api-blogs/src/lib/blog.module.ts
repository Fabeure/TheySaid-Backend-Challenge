import { Module } from '@nestjs/common';
import { BlogResolver } from './blog.resolver';
import { BlogService } from './blog.service';

@Module({
  controllers: [],
  providers: [BlogResolver, BlogService],
  exports: [],
})
export class BlogModule { }
