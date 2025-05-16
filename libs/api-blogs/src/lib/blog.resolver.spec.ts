import { Test, TestingModule } from '@nestjs/testing';
import { BlogResolver } from './blog.resolver';
import { BlogService } from './blog.service';
import { PubSubService } from '@myorg/api-core';
import { Blog, BlogNotFoundError, BlogTitleExistsError } from '@myorg/api-models';

describe('BlogResolver', () => {
  let resolver: BlogResolver;
  let blogService: BlogService;
  let pubSub: PubSubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogResolver,
        {
          provide: BlogService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            titleExists: jest.fn(),
          },
        },
        {
          provide: PubSubService,
          useValue: {
            publish: jest.fn(),
            asyncIterator: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<BlogResolver>(BlogResolver);
    blogService = module.get<BlogService>(BlogService);
    pubSub = module.get<PubSubService>(PubSubService);
  });

  const mockBlog: Blog = {
    id: '1',
    title: 'Test Blog',
    content: 'Test content',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('getBlogs', () => {
    it('should return an array of blogs', async () => {
      blogService.findAll = jest.fn().mockResolvedValue([mockBlog]);
      const result = await resolver.getBlogs(0, 10);
      expect(result).toEqual([mockBlog]);
      expect(blogService.findAll).toHaveBeenCalledWith(0, 10);
    });
  });

  describe('getBlogById', () => {
    it('should return a blog when found', async () => {
      blogService.findOne = jest.fn().mockResolvedValue(mockBlog);
      const result = await resolver.getBlogById('1');
      expect(result).toEqual(mockBlog);
    });

    it('should return BlogNotFoundError when not found', async () => {
      blogService.findOne = jest.fn().mockResolvedValue(null);
      const result = await resolver.getBlogById('999');
      expect(result).toBeInstanceOf(BlogNotFoundError);
    });
  });

  describe('createBlog', () => {
    it('should create and return a new blog', async () => {
      blogService.titleExists = jest.fn().mockResolvedValue(false);
      blogService.create = jest.fn().mockResolvedValue(mockBlog);

      const result = await resolver.createBlog({ title: 'New Blog', content: 'Content' });

      expect(result).toEqual(mockBlog);
      expect(pubSub.publish).toHaveBeenCalledWith('BLOG_ADDED', { blogAdded: mockBlog });
    });

    it('should return BlogTitleExistsError if title exists', async () => {
      blogService.titleExists = jest.fn().mockResolvedValue(true);
      const result = await resolver.createBlog({ title: 'Existing Blog', content: 'Content' });
      expect(result).toBeInstanceOf(BlogTitleExistsError);
    });
  });

  describe('updateBlog', () => {
    it('should update and return the blog', async () => {
      blogService.findOne = jest.fn().mockResolvedValue(mockBlog);
      blogService.titleExists = jest.fn().mockResolvedValue(false);
      blogService.update = jest.fn().mockResolvedValue({ ...mockBlog, title: 'Updated' });

      const result = await resolver.updateBlog({ id: '1', title: 'Updated' });
      expect(result).toEqual({ ...mockBlog, title: 'Updated' });
    });

    it('should return BlogNotFoundError if blog not found', async () => {
      blogService.findOne = jest.fn().mockResolvedValue(null);
      const result = await resolver.updateBlog({ id: '999', title: 'Updated' });
      expect(result).toBeInstanceOf(BlogNotFoundError);
    });

    it('should return BlogTitleExistsError if new title exists', async () => {
      blogService.findOne = jest.fn().mockResolvedValue(mockBlog);
      blogService.titleExists = jest.fn().mockResolvedValue(true);
      const result = await resolver.updateBlog({ id: '1', title: 'Existing Title' });
      expect(result).toBeInstanceOf(BlogTitleExistsError);
    });
  });

  describe('deleteBlog', () => {
    it('should return true when deletion succeeds', async () => {
      blogService.findOne = jest.fn().mockResolvedValue(mockBlog);
      blogService.remove = jest.fn().mockResolvedValue(undefined);

      const result = await resolver.deleteBlog('1');
      expect(result).toBe(true);
    });

    it('should return BlogNotFoundError if blog not found', async () => {
      blogService.findOne = jest.fn().mockResolvedValue(null);
      const result = await resolver.deleteBlog('999');
      expect(result).toBeInstanceOf(BlogNotFoundError);
    });
  });

  describe('blogAdded', () => {
    it('should return async iterator', () => {
      const mockIterator = { [Symbol.asyncIterator]: jest.fn() };
      pubSub.asyncIterator = jest.fn().mockReturnValue(mockIterator);

      const result = resolver.blogAdded();
      expect(result).toEqual(mockIterator);
      expect(pubSub.asyncIterator).toHaveBeenCalledWith('BLOG_ADDED');
    });

    it('should throw error if subscription fails', () => {
      pubSub.asyncIterator = jest.fn().mockImplementation(() => {
        throw new Error('Subscription error');
      });

      expect(() => resolver.blogAdded()).toThrow('Could not establish subscription');
    });
  });
});