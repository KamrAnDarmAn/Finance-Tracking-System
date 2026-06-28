import {
  Resolver,
  Mutation,
  Query,
  Arg,
  ArgsType,
  Field,
  Args,
  ObjectType,
  Ctx,
  InputType,
} from "type-graphql";
import { User } from "../entities/users.entity.ts";
import bcrypt from "bcryptjs";
import { GraphQLContext } from "../types/index.ts";
import { createAccessToken, createRefereshToken } from "../lib/auth.ts";

@ArgsType()
class ProfileInput {
  @Field(() => String, { nullable: true })
  phone!: string;
  @Field(() => String, { nullable: true })
  address!: string;
  @Field(() => String, { nullable: true })
  city!: string;
  @Field(() => String, { nullable: true })
  country!: string;
  @Field(() => String, { nullable: true })
  postalCode!: string;
}

@ArgsType()
class CredentialsArgs {
  @Field((type) => String!)
  email!: string;

  @Field((type) => String!)
  password!: string;

  @Field((type) => String!)
  username!: string;
}

@ObjectType()
class AuthPayload {
  @Field((returns) => Boolean)
  success!: boolean;

  @Field((returns) => String, { nullable: true })
  token!: string;

  @Field((returns) => String, { nullable: false })
  message!: string;
}

@Resolver(User)
export class UserResolvers {
  @Query((returns) => String)
  health() {
    return "ok";
  }

  @Query((returns) => [User])
  users() {
    return User.find();
  }
  @Mutation((returns) => AuthPayload)
  async signup(
    @Arg("email", () => String!, { nullable: false }) email: string,
    @Arg("password", () => String!, { nullable: false }) password: string,
    @Arg("firstName", () => String!, { nullable: false }) firstName: string,
    @Arg("lastName", () => String, { nullable: false }) lastName: string,
    @Args() profile: ProfileInput
    @Ctx() { res }: GraphQLContext,
  ) {
    try {
      const user = await User.findOneBy({ email });

      if (user) {
        return {
          success: false,
          token: null,
          message: "User already exists.",
        };
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        
      });

      newUser.save();

      const accessToken = createAccessToken({ userId: newUser.id });
      const refereshToken = createRefereshToken({ userId: newUser.id });
      res.cookie("jit", refereshToken);
      return {
        success: true,
        token: accessToken,
        message: "signed up successfully.",
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        token: null,
        message: "Uexpected Server Error",
      };
    }
  }
  @Mutation((returns) => AuthPayload)
  async signin(
    @Arg("email", () => String!, { nullable: false }) email: string,
    @Arg("password", () => String!, { nullable: false }) password: string,
    @Ctx() { res }: GraphQLContext,
  ) {
    try {
      const user = await User.findOneBy({ email });
      if (!user)
        return { success: false, token: null, message: "Invalid credentials" };

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch)
        return { success: false, token: null, message: "Invalid credentials" };

      const accessToken = await createAccessToken({ userId: user.id });
      const refereshToken = await createRefereshToken({ userId: user.id });
      res.cookie("jit", refereshToken);
      return {
        success: true,
        token: accessToken,
        message: "Signed in successfullay.",
      };
    } catch (error) {
      return {
        success: false,
        token: null,
        message: "Unexpected Server Error.",
      };
    }
  }
}
