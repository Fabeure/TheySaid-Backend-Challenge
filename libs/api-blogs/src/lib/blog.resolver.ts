import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlogService } from './blog.service';
import { Blog } from '@myorg/api-models';
import { CreateBlogInput, UpdateBlogInput } from '@myorg/api-models';
import {
    BlogResponseUnion,
    BlogNotFoundError,
    BlogTitleExistsError,
} from '@myorg/api-models';
import { InternalServerErrorException } from '@nestjs/common';

@Resolver(() => Blog)
export class BlogResolver {
    constructor(private readonly blogService: BlogService) { }

    @Query(() => [Blog], { name: 'blogs', description: 'Get all blogs with optional pagination' })
    async getBlogs(
        @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 }) skip: number,
        @Args('take', { type: () => Int, nullable: true, defaultValue: 10 }) take: number,
    ) {
        return this.blogService.findAll(skip, take);
    }

    @Query(() => BlogResponseUnion, { name: 'blog', description: 'Get a blog by ID' })
    async getBlogById(
        @Args('id', { type: () => ID, description: 'Blog ID' }) id: string,
    ) {
        const blog = await this.blogService.findOne(id);
        if (!blog) {
            return new BlogNotFoundError(id);
        }
        return blog;
    }

    @Mutation(() => BlogResponseUnion, { name: 'createBlog', description: 'Create a new blog' })
    async createBlog(
        @Args('input', { type: () => CreateBlogInput }) input: CreateBlogInput
    ) {
        const titleExists = await this.blogService.titleExists(input.title);
        if (titleExists) {
            return new BlogTitleExistsError(input.title);
        }

        return await this.blogService.create(input);
    }

    @Mutation(() => BlogResponseUnion, { name: 'updateBlog', description: 'Update an existing blog' })
    async updateBlog(
        @Args('input', { type: () => UpdateBlogInput }) input: UpdateBlogInput,
    ) {
        const existingBlog = await this.blogService.findOne(input.id);
        if (!existingBlog) {
            return new BlogNotFoundError(input.id);
        }

        if (input.title && input.title !== existingBlog.title) {
            const titleExists = await this.blogService.titleExists(input.title);
            if (titleExists) {
                return new BlogTitleExistsError(input.title);
            }
        }

        return await this.blogService.update(input);
    }

    @Mutation(() => BlogResponseUnion, { name: 'deleteBlog', description: 'Delete a blog' })
    async deleteBlog(
        @Args('id', { type: () => ID }) id: string
    ) {
        const blog = await this.blogService.findOne(id);
        if (!blog) {
            return new BlogNotFoundError(id);
        }

        await this.blogService.remove(id);
        return blog;
    }
}