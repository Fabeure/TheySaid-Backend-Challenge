import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Blog {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: string;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    content?: string;

    @Field()
    @Column()
    createdAt: Date;

    @Field()
    @Column()
    updatedAt: Date;
}