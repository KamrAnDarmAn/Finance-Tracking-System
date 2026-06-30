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
  Authorized,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entities/users.entity.ts";
import bcrypt from "bcryptjs";
import { GraphQLContext } from "../types/index.ts";
import { createAccessToken, createRefereshToken } from "../lib/auth.ts";
import { db } from "@/lib/db.ts";
import { testMiddlware } from "@/middlewares/test.middleware.ts";

@InputType()
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

@Resolver()
export class AuthResolvers {
  @Query((returns) => [User])
  async users() {
    const users = await User.find();

    if (!users) return [];

    return users;
  }
  @Mutation((returns) => AuthPayload)
  async signup(
    @Arg("email", () => String!, { nullable: false }) email: string,
    @Arg("password", () => String!, { nullable: false }) password: string,
    @Arg("firstName", () => String!, { nullable: false }) firstName: string,
    @Arg("lastName", () => String, { nullable: false }) lastName: string,
    @Arg("profile", () => ProfileInput) profile: ProfileInput,
    @Ctx() { res }: GraphQLContext,
  ) {
    try {
      const user = await db.user.findOneBy({ email });

      if (user) {
        return {
          success: false,
          token: null,
          message: "User already exists.",
        };
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await db.user.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      newUser.save();

      if (profile) {
        const newProfile = db.profile.create({ ...profile });
        newProfile.user = newUser;
        newProfile.save();
      }

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
      const user = await db.user.findOneBy({ email });
      if (!user)
        return { success: false, token: null, message: "Invalid credentials" };

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch)
        return { success: false, token: null, message: "Invalid credentials" };

      const accessToken = await createAccessToken({ userId: user.id });
      const refereshToken = await createRefereshToken({ userId: user.id });
      console.log("REFERESH TOKEN:", refereshToken);
      console.log("ACCESS TOKEN:", accessToken);
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

  @Query((returns) => User)
  @Authorized()
  async me(@Ctx() { req }: GraphQLContext) {
    // if (!session) return null;
    console.log(req.user);
    // const user = await session();
    // return await db.user.findOneBy({ id: user!.userId });
    const user = await db.user.find();

    return user[0];
  }
}
