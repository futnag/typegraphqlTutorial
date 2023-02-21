import { MyContext } from "./../../types/MyContext";
import { Ctx, Query, Resolver } from "type-graphql";
import { User } from "../../entity/User";

declare module "express-session" {
  interface SessionData {
    userId: any;
  }
}

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true, complexity: 10 })
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    if (!ctx.req.session!.userId) {
      return null;
    }
    return User.findOne({ where: { id: ctx.req.session!.userId } });
  }
}
