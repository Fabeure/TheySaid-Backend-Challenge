import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export abstract class BaseError {
  @Field()
  message: string;

  @Field(() => String)
  code: string;

  constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
  }
}