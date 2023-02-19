import { Arg, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class RegisterResolver {
  // @Authorized()
  @UseMiddleware(isAuth)
  @Query(() => String, { nullable: true, description: "its' description!" })
  async hello() {
    return "Hello, World";
  }

  @Query(() => [User], { nullable: true })
  async getUser() {
    const user = await User.find({
      select: {
        firstName: true,
        lastName: true,
        id: true,
        email: true,
      },
    });
    return user;
  }

  @Query(() => Int, { nullable: true })
  async userCount() {
    const count = User.count();
    return count;
  }

  // @FieldResolver()
  // async name(@Root() parent: User) {
  //   return `${parent.firstName} ${parent.lastName}`;
  // }

  @Mutation(() => User)
  async register(
    @Arg("input") { email, firstName, lastName, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();
    return user;
  }
}
