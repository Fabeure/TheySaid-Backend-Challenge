import { InputType, Field } from '@nestjs/graphql';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    MinLength,
} from 'class-validator';

@InputType()
export class CreateBlogInput {
    @Field({ description: 'Title of the blog' })
    @IsString()
    @IsNotEmpty()
    @MinLength(3, {
        message: 'Title is too short. Minimum length is 3 characters',
    })
    @MaxLength(100, {
        message: 'Title is too long. Maximum length is 100 characters',
    })
    title: string;

    @Field({ description: 'Content of the blog' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(5000, {
        message: 'Content is too long. Maximum length is 5000 characters',
    })
    content?: string;
}