import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLErrorCodes } from '../../graphql/errors/error-codes.enum';

@ObjectType()
export class BlogNotFoundError {
    @Field(() => String)
    message: string;

    @Field(() => String)
    blogId: string;

    @Field(() => String)
    code: string = GraphQLErrorCodes.BLOG_NOT_FOUND;

    constructor(blogId: string) {
        this.message = `Blog with ID ${blogId} not found`;
        this.blogId = blogId;
    }
}

@ObjectType()
export class BlogTitleExistsError {
    @Field(() => String)
    message: string;

    @Field(() => String)
    title: string;

    @Field(() => String)
    code: string = GraphQLErrorCodes.BLOG_TITLE_EXISTS;

    constructor(title: string) {
        this.message = `Blog with title "${title}" already exists`;
        this.title = title;
    }
}