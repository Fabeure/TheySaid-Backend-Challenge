import { Args, ID, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { BlogService } from './blog.service';
import { Blog, CreateBlogInput, UpdateBlogInput } from '@myorg/api-models';
import {
    BlogResponseUnion,
    BlogNotFoundError,
    BlogTitleExistsError,
} from '@myorg/api-models';
import { PubSubService } from '@myorg/api-core'
import { Inject } from '@nestjs/common';

@Resolver(() => Blog)
export class BlogResolver {
    constructor(
        private readonly blogService: BlogService,
        @Inject(PubSubService) private readonly pubSub: PubSubService

    ) { }

    @Query(() => [Blog], { name: 'blogs', description: 'Get all blogs with optional pagination' })
    async getBlogs(
        @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 }) skip: number,
        @Args('take', { type: () => Int, nullable: true, defaultValue: 10 }) take: number,
    ): Promise<Blog[]> {
        return this.blogService.findAll(skip, take);
    }

    @Query(() => BlogResponseUnion, { name: 'blog', description: 'Get a blog by ID' })
    async getBlogById(
        @Args('id', { type: () => ID, description: 'Blog ID' }) id: string,
    ): Promise<Blog | BlogNotFoundError | BlogTitleExistsError> { // nit manually concatenating return types for clarity :)
        const blog = await this.blogService.findOne(id);
        if (!blog) {
            return new BlogNotFoundError(id);
        }

        return blog;
    }

    @Mutation(() => BlogResponseUnion, { name: 'createBlog', description: 'Create a new blog' })
    async createBlog(
        @Args('input', { type: () => CreateBlogInput }) input: CreateBlogInput
    ): Promise<typeof BlogResponseUnion> {
        const titleExists = await this.blogService.titleExists(input.title);
        if (titleExists) {
            return new BlogTitleExistsError(input.title);
        }

        const blog = await this.blogService.create(input);
        await this.pubSub.publish('BLOG_ADDED', { blogAdded: blog });
        return blog;
    }

    @Mutation(() => BlogResponseUnion, { name: 'updateBlog', description: 'Update an existing blog' })
    async updateBlog(
        @Args('input', { type: () => UpdateBlogInput }) input: UpdateBlogInput,
    ): Promise<typeof BlogResponseUnion> {
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

        return await this.blogService.update(existingBlog, input);
    }

    @Mutation(() => Boolean, { name: 'deleteBlog', description: 'Delete a blog' })
    async deleteBlog(
        @Args('id', { type: () => ID }) id: string
    ): Promise<boolean | BlogNotFoundError> {
        const blog = await this.blogService.findOne(id);
        if (!blog) {
            return new BlogNotFoundError(id);
        }

        await this.blogService.remove(blog);
        return true;
    }

    @Subscription(() => Blog, {
        name: 'blogAdded',
        description: 'Subscribe to new blog posts in real-time'
    })
    blogAdded() {
        try {
            return this.pubSub.asyncIterator('BLOG_ADDED');
        } catch (error) {
            throw new Error('Could not establish subscription');
        }
    }
}
