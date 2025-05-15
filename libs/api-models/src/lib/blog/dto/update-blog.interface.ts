import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import {
    IsString,
    IsNotEmpty,
    IsUUID,
} from 'class-validator';
import { CreateBlogInput } from './create-blog.interface';

@InputType()
export class UpdateBlogInput extends PartialType(CreateBlogInput) {
    @Field(() => ID, { description: 'ID of the blog to update' })
    @IsString()
    @IsNotEmpty()
    @IsUUID('4', { message: 'ID must be a valid UUID' })
    id: string;
}