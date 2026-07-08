import {
  Resolver,
  Mutation,
  Query,
  Arg,
  Field,
  ObjectType,
  Ctx,
  InputType,
  UseMiddleware,
} from "type-graphql";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../entities/users.entity.ts";
import { GraphQLContext } from "../types/index.ts";
import {
  createAccessToken,
  createRefereshToken,
} from "../lib/auth.ts";
import { db } from "@/lib/db.ts";
import { validateSchema } from "@/middlewares/validate-schema.middleware.ts";
import {
  signinSchema,
  signupSchema,
} from "@/validations/auth.validation.ts";
import { changePasswordSchema } from "@/validations/user.validations.ts";
import { protectedUser } from "@/middlewares/auth.middleware.ts";

@InputType()
export class ProfileInput {
  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => Number, { nullable: true })
  postalCode?: number;
}

@ObjectType()
class AuthPayload {
  @Field(() => Boolean)
  success!: boolean;

  @Field(() => String, { nullable: true })
  token?: string | null;

  @Field(() => String)
  message!: string;
}

@Resolver()
export class AuthResolvers {
  @Mutation(() => AuthPayload)
  @UseMiddleware(validateSchema(signupSchema))
  async signup(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Arg("firstName", () => String) firstName: string,
    @Arg("lastName", () => String, { nullable: true }) lastName: string,
    @Arg("profile", () => ProfileInput, { nullable: true })
    profile: ProfileInput | undefined,
    @Ctx() { res }: GraphQLContext,
  ) {
    try {
      const existingUser = await db.user.findOneBy({ email });

      if (existingUser) {
        return {
          success: false,
          token: null,
          message: "User already exists.",
        };
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = db.user.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });
      await newUser.save();

      const newProfile = db.profile.create({
        phone: profile?.phone,
        address: profile?.address,
        city: profile?.city,
        country: profile?.country,
        postalCode: profile?.postalCode,
      });
      newProfile.user = newUser;
      await newProfile.save();

      const preferences = db.userPreferences.create({});
      preferences.user = newUser;
      await preferences.save();

      const accessToken = await createAccessToken({ userId: newUser.id });
      const refreshToken = await createRefereshToken({ userId: newUser.id });
      res.cookie("jit", refreshToken, { httpOnly: true, sameSite: "strict" });

      return {
        success: true,
        token: accessToken,
        message: "Signed up successfully.",
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        token: null,
        message: "Unexpected server error.",
      };
    }
  }

  @Mutation(() => AuthPayload)
  @UseMiddleware(validateSchema(signinSchema))
  async signin(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() { res }: GraphQLContext,
  ) {
    try {
      const user = await db.user.findOneBy({ email });
      if (!user) {
        return {
          success: false,
          token: null,
          message: "Invalid credentials.",
        };
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return {
          success: false,
          token: null,
          message: "Invalid credentials.",
        };
      }

      const accessToken = await createAccessToken({ userId: user.id });
      const refreshToken = await createRefereshToken({ userId: user.id });
      res.cookie("jit", refreshToken, { httpOnly: true, sameSite: "strict" });

      return {
        success: true,
        token: accessToken,
        message: "Signed in successfully.",
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        token: null,
        message: "Unexpected server error.",
      };
    }
  }

  @Mutation(() => AuthPayload)
  @UseMiddleware(protectedUser)
  async signout(@Ctx() { res }: GraphQLContext) {
    res.clearCookie("jit");
    return {
      success: true,
      token: null,
      message: "Signed out successfully.",
    };
  }

  @Mutation(() => AuthPayload)
  async refreshToken(
    @Arg("refreshToken", () => String) refreshToken: string,
    @Ctx() { res }: GraphQLContext,
  ) {
    try {
      const decode = jwt.verify(
        refreshToken,
        process.env.REFERESH_TOKEN_SECRET!,
      ) as { userId: string };

      const user = await db.user.findOneBy({ id: decode.userId });
      if (!user) {
        return {
          success: false,
          token: null,
          message: "Invalid refresh token.",
        };
      }

      const accessToken = await createAccessToken({ userId: user.id });
      const newRefreshToken = await createRefereshToken({ userId: user.id });
      res.cookie("jit", newRefreshToken, { httpOnly: true, sameSite: "strict" });

      return {
        success: true,
        token: accessToken,
        message: "Token refreshed successfully.",
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        token: null,
        message: "Invalid or expired refresh token.",
      };
    }
  }

  @Mutation(() => AuthPayload)
  @UseMiddleware(protectedUser, validateSchema(changePasswordSchema))
  async changePassword(
    @Arg("currentPassword", () => String) currentPassword: string,
    @Arg("newPassword", () => String) newPassword: string,
    @Ctx() { req }: GraphQLContext,
  ) {
    try {
      const user = req.user!;
      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        user.password,
      );

      if (!isPasswordMatch) {
        return {
          success: false,
          token: null,
          message: "Current password is incorrect.",
        };
      }

      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();

      return {
        success: true,
        token: null,
        message: "Password changed successfully.",
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        token: null,
        message: "Unexpected server error.",
      };
    }
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(protectedUser)
  async me(@Ctx() { req }: GraphQLContext) {
    return db.user.findOne({
      where: { id: req.user!.id },
      relations: { profile: true, preferences: true },
    });
  }
}
