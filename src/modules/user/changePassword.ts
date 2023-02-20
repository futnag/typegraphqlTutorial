import { MyContext } from "./../../types/MyContext";
import { User } from "../../entity/User";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import bcrypt from "bcryptjs";
import { redis } from "../../redis";
import { forgetPasswordPrefix } from "../constants/redisPrefixes";
import { ChangePasswordInput } from "./changePassword/ChangePasswordInput";

declare module "express-session" {
  interface SessionData {
    userId: any;
  }
}

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("data") { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const userId = await redis.get(forgetPasswordPrefix + token);
    if (!userId) {
      return null;
    }
    const user = await User.findOne({ where: { id: parseInt(userId, 10) } });
    if (!user) {
      return null;
    }
    await redis.del(forgetPasswordPrefix + token);
    user.password = await bcrypt.hash(password, 12);
    await user.save();

    ctx.req.session.userId = user.id;
    return user;
  }
}
