import { Arg, Mutation, Resolver } from "type-graphql";
import { User } from "../../entity/User";
import { redis } from "../../redis";

declare module "express-session" {
  interface SessionData {
    userId: any;
  }
}

@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<boolean> {
    console.log("[log] token : ", token);
    const userId = await redis.get(token);
    console.log("[log] userId : ", userId);
    if (!userId) {
      return false;
    }
    await User.update({ id: parseInt(userId, 10) }, { confirmed: true });
    redis.del(token);
    return true;
  }
}
