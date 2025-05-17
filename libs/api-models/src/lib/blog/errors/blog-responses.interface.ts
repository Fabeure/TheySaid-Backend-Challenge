import { ObjectType, Field, createUnionType, ID } from '@nestjs/graphql';
import { BaseError } from '../../graphql/errors/errors.interface';
import { Blog } from '../model/blog.interface';
import { BlogGraphQLErrorCodes } from './blog-errors.enum';

@ObjectType()
export class BlogNotFoundError extends BaseError {
  @Field(() => ID)
  id: string;

  constructor(id: string) {
    super(BlogGraphQLErrorCodes.BLOG_NOT_FOUND, `Blog with ID ${id} not found`);
    this.id = id;
  }
}

@ObjectType()
export class BlogTitleExistsError extends BaseError {
  @Field(() => String)
  title: string;

  constructor(title: string) {
    super(BlogGraphQLErrorCodes.BLOG_TITLE_EXISTS, `Blog with title "${title}" already exists`);
    this.title = title;
  }
}

@ObjectType()
export class DeleteBlogSuccess {
    @Field(() => Boolean)
    success: boolean;

    constructor(success: boolean) {
        this.success = success;
    }
}

export const BlogResponseUnion = createUnionType({
    name: 'BlogResponse',
    types: () => [
        Blog,
        BlogNotFoundError,
        BlogTitleExistsError,
        DeleteBlogSuccess,
    ],
});