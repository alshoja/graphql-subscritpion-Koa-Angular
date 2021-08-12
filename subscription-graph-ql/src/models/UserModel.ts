import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class UserModel {

    @Field()
    firstName!: string;

    @Field()
    lastName!: string;

    @Field()
    age!: number;
}
