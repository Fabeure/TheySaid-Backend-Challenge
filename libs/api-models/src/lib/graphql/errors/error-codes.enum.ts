import { BlogNotFoundError, BlogTitleExistsError } from "../../blog/errors/blog-errors.interface";
import { createUnionType } from "@nestjs/graphql";
import { Blog } from "../../blog/model/blog.interface";

export enum GraphQLErrorCodes {
    BLOG_NOT_FOUND = 'BLOG_NOT_FOUND',
    BLOG_TITLE_EXISTS = 'BLOG_TITLE_EXISTS',
}

export const BlogResponseUnion = createUnionType({
    name: 'BlogResponse',
    types: () => [
        Blog,
        BlogNotFoundError,
        BlogTitleExistsError,
    ],
});