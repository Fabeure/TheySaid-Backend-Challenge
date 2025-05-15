import { Module } from '@nestjs/common';
import { BlogResolver } from './blog.resolver';
import { BlogService } from './blog.service';
import { Blog } from '@myorg/api-models'
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [],
  providers: [BlogResolver, BlogService],
  exports: [],
  imports: [TypeOrmModule.forFeature([Blog])]
})
export class BlogModule { }
