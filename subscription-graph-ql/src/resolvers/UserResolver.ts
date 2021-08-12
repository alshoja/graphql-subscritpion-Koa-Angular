import { User } from "../entity/User";
import { Arg, Mutation, PubSub, PubSubEngine, Query, Resolver, Root, Subscription } from "type-graphql";
import { UserModel } from "../models/UserModel";
import { UserPayload } from "src/interfaces/UserPayload";

const channel = "USER_CHANNEL";

@Resolver()
export class UserResolver {
    @Mutation(() => Boolean)
    async createUser(
        @PubSub() pubSub: PubSubEngine,
        @Arg("firstName") firstName: string,
        @Arg("lastName") lastName: string,
        @Arg("age") age: number) {
        const payload = await User.create({ firstName, lastName, age });
        await pubSub.publish(channel, payload);
        return true;
    }

    @Query(() => [User])
    users() {
        return User.find();
    }

    @Subscription({ topics: channel })
    subscribeUserCreation(@Root() { firstName, lastName, age }: UserPayload): UserModel {
        return { firstName, lastName, age };
    }
}