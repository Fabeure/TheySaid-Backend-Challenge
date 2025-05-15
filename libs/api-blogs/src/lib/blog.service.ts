import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog, CreateBlogInput, UpdateBlogInput } from '@myorg/api-models'

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(Blog)
        private readonly blogRepository: Repository<Blog>,
    ) { }

    async create(blogData: CreateBlogInput): Promise<Blog> {
        const blog = this.blogRepository.create(blogData);

        try {
            return await this.blogRepository.save(blog);
        } catch (error) {
            throw new InternalServerErrorException(`Failed to add blog.`);
        }
    }

    async findAll(skip: number, take: number): Promise<Blog[]> {
        try {
            const blogs = await this.blogRepository.find({
                skip: skip,
                take: take
            });

            return blogs;
        } catch (error) {
            throw new InternalServerErrorException(`Failed to fetch blogs.`);
        }
    }

    async findOne(id: string): Promise<Blog | null> {
        try {
            const blog = await this.blogRepository.findOne({ where: { id } });
            return blog;
        } catch (error) {
            throw new InternalServerErrorException(`Failed to fetch blog.`);
        }
    }

    async update(updateData: UpdateBlogInput): Promise<Blog> {
        let { id, ...updates } = updateData;


        const blog = await this.blogRepository.preload({
            id,
            ...updates,
        });

        if (!blog) {
            throw new NotFoundException(`Blog with ID ${id} not found`);
        }

        try {
            return await this.blogRepository.save(blog);
        } catch (error) {
            throw new InternalServerErrorException(`Failed to update blog with ID ${id}`);
        }
    }


    async remove(id: string): Promise<void> {
        const result = await this.blogRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Blog with ID ${id} not found, nothing deleted.`);
        }
    }

    async titleExists(title: string): Promise<boolean> {
        try {
            const count = await this.blogRepository.count({
                where: { title },
            });
            return count > 0;
        } catch (error) {
            throw new ConflictException('Failed to check blog title existence');
        }
    }
}