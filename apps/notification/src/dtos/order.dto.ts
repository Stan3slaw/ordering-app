import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DateResolver } from 'graphql-scalars';

@ObjectType()
export class Order {
  @Field(() => Int, { nullable: true })
  id: number;

  @Field(() => Int, { nullable: true })
  orderId: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  details: string;

  @Field(() => Int, { nullable: true })
  totalPrice: number;

  @Field(() => DateResolver, { nullable: true })
  createdAt: Date;

  @Field(() => DateResolver, { nullable: true })
  updatedAt: Date;
}
