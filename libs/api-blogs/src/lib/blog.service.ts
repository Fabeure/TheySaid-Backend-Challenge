import { Injectable, ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog, CreateBlogInput, UpdateBlogInput } from '@myorg/api-models'

@Injectable()
export class BlogService {
    private readonly logger = new Logger(BlogService.name);

    constructor(
        @InjectRepository(Blog)
        private readonly blogRepository: Repository<Blog>,
    ) { }

    async create(blogData: CreateBlogInput): Promise<Blog> {
        this.logger.log(`Creating new blog with title: "${blogData.title}"`);
        const blog = this.blogRepository.create(blogData);

        try {
            const result = await this.blogRepository.save(blog);
            this.logger.log(`Successfully created blog with ID: ${result.id}`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to create blog: ${error}`);
            throw new InternalServerErrorException(`Failed to add blog.`);
        }
    }

    async findAll(skip: number, take: number): Promise<Blog[]> {
        this.logger.debug(`Fetching blogs with pagination (skip: ${skip}, take: ${take})`);

        try {
            const blogs = await this.blogRepository.find({
                skip: skip,
                take: take
            });
            this.logger.debug(`Found ${blogs.length} blogs`);
            return blogs;

        } catch (error) {
            this.logger.error(`Failed to fetch blogs: ${error}`);
            throw new InternalServerErrorException(`Failed to fetch blogs.`);
        }
    }

    async findOne(id: string): Promise<Blog | null> {
        this.logger.debug(`Looking up blog with ID: ${id}`);

        try {
            const blog = await this.blogRepository.findOne({ where: { id } });
            return blog;
        } catch (error) {
            this.logger.error(`Failed to fetch blog ${id}: ${error}`);
            throw new InternalServerErrorException(`Failed to fetch blog.`);
        }
    }

    async update(blog: Blog, updateData: UpdateBlogInput): Promise<Blog> {
        this.logger.log(`Updating blog with ID: ${blog.id}`);

        Object.assign(blog, updateData);

        try {
            const result = await this.blogRepository.save(blog);
            this.logger.log(`Successfully updated blog with ID: ${blog.id}`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to update blog ${blog.id}: ${error}`);
            throw new InternalServerErrorException(`Failed to update blog with ID ${blog.id}`);
        }
    }


    async remove(blog: Blog): Promise<void> {
        this.logger.log(`Attempting to delete blog with ID: ${blog.id}`);

        try {
            await this.blogRepository.remove(blog);
            this.logger.log(`Successfully deleted blog with ID: ${blog.id}`);
        } catch (error) {
            this.logger.error(`Failed to delete blog ${blog.id}: ${error}`);
            throw new InternalServerErrorException(`Failed to delete blog with ID ${blog.id}`);
        }
    }

    async titleExists(title: string): Promise<boolean> {
        this.logger.debug(`Checking if title exists: "${title}"`);

        try {
            const count = await this.blogRepository.count({
                where: { title },
            });

            const exists = count > 0;
            this.logger.debug(`Title "${title}" ${exists ? 'already exists' : 'is available'}`);
            return exists;

        } catch (error) {
            this.logger.error(`Failed to check title existence "${title}": ${error}`);
            throw new ConflictException('Failed to check blog title existence');
        }
    }
}