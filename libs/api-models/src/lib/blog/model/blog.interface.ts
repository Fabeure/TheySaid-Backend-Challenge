import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Blog {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Index()
    @Column({ nullable: false })
    title: string;

    @Field()
    @Column({ type: 'text', nullable: false })
    content?: string;

    @Field()
    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @Field()
    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;
}