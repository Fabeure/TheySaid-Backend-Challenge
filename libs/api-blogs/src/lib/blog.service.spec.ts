import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogService } from './blog.service';
import { Blog } from '@myorg/api-models';
import { ConflictException } from '@nestjs/common';

describe('BlogService', () => {
  let service: BlogService;
  let blogRepository: Repository<Blog>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        {
          provide: getRepositoryToken(Blog),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            count: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
    blogRepository = module.get<Repository<Blog>>(getRepositoryToken(Blog));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Utility function for creating a mock blog
  const mockBlog = (id: string, title: string): Blog => ({
    id,
    title,
    content: 'Test content',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  describe('create', () => {
    it('should successfully create a blog', async () => {
      const blogData = { title: 'Test Blog', content: 'Test content' };
      const savedBlog = mockBlog('1', blogData.title);

      jest.spyOn(blogRepository, 'create').mockReturnValue(savedBlog);
      jest.spyOn(blogRepository, 'save').mockResolvedValue(savedBlog);

      const result = await service.create(blogData);
      expect(blogRepository.create).toHaveBeenCalledWith(blogData);
      expect(blogRepository.save).toHaveBeenCalledWith(savedBlog);
      expect(result).toEqual(savedBlog);
    });

    it('should throw when saving fails', async () => {
      const blogData = { title: 'Test Blog', content: 'Test content' };
      jest.spyOn(blogRepository, 'save').mockImplementation(() => {
        throw new Error('DB Error');
      });

      await expect(service.create(blogData)).rejects.toThrow('Failed to add blog');
    });
  });

  describe('findAll', () => {
    it('should return an array of blogs', async () => {
      const blogs = [mockBlog('1', 'Blog 1'), mockBlog('2', 'Blog 2')];
      jest.spyOn(blogRepository, 'find').mockResolvedValue(blogs);

      const result = await service.findAll(0, 10);
      expect(result).toEqual(blogs);
      expect(blogRepository.find).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return a blog if found', async () => {
      const blog = mockBlog('1', 'Found Blog');
      jest.spyOn(blogRepository, 'findOne').mockResolvedValue(blog);

      const result = await service.findOne('1');
      expect(result).toEqual(blog);
    });

    it('should return null if not found', async () => {
      jest.spyOn(blogRepository, 'findOne').mockResolvedValue(null);
      const result = await service.findOne('999');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a blog', async () => {
      const existingBlog = mockBlog('1', 'Old Title');
      const updatedData = { title: 'New Title' };
      const updatedBlog = { ...existingBlog, ...updatedData };

      jest.spyOn(blogRepository, 'save').mockResolvedValue(updatedBlog);

      const result = await service.update(existingBlog, updatedBlog);
      expect(result.title).toBe('New Title');
      expect(blogRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a blog', async () => {
      const blog = mockBlog('1', 'To be deleted');
      const removeSpy = jest.spyOn(blogRepository, 'remove');

      await service.remove(blog);
      expect(removeSpy).toHaveBeenCalledWith(blog);
    });
  });

  describe('titleExists', () => {
    it('should return true if the title exists', async () => {
      jest.spyOn(blogRepository, 'count').mockResolvedValue(1);

      const result = await service.titleExists('Existing Title');
      expect(result).toBe(true);
      expect(blogRepository.count).toHaveBeenCalledWith({
        where: { title: 'Existing Title' },
      });
    });

    it('should return false if the title does not exist', async () => {
      jest.spyOn(blogRepository, 'count').mockResolvedValue(0);

      const result = await service.titleExists('New Title');
      expect(result).toBe(false);
    });

    it('should throw ConflictException if the query fails', async () => {
      jest.spyOn(blogRepository, 'count').mockImplementation(() => {
        throw new Error('DB error');
      });

      await expect(service.titleExists('Error Title')).rejects.toThrow(ConflictException);
    });
  });
});

