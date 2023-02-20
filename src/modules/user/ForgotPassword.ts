import { User } from "../../entity/User";
import { Arg, Mutation, Resolver } from "type-graphql";
import { v4 } from "uuid";
import { sendEmail } from "../utils/sendEmail";
import { redis } from "../../redis";
import { forgetPasswordPrefix } from "../constants/redisPrefixes";

declare module "express-session" {
  interface SessionData {
    userId: any;
  }
}

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return false;
    }

    const token = v4();
    await redis.setex(forgetPasswordPrefix + token, 60 * 60 * 24, user.id); // 1 day expiration

    await sendEmail(email, `http://localhost:3000/user/change-password/${token}`);
    return true;
  }
}
