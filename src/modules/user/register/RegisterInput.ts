import { PasswordMixin } from "./../../shared/PasswordInput";
import { Field, InputType } from "type-graphql";
import { IsEmail, Length } from "class-validator";
import { IsEmailAlreadyExist } from "./IsEmailAlreadyExist";
import { OkMixin } from "../../../modules/shared/OkMixin";

@InputType()
export class RegisterInput extends OkMixin(PasswordMixin(class {})) {
  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: "email already in use." })
  email: string;
}
