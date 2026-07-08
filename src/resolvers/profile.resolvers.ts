import { Profile } from "@/entities/profiles.entity.ts";
import { db } from "@/lib/db.ts";
import { protectedUser } from "@/middlewares/auth.middleware.ts";
import { validateSchema } from "@/middlewares/validate-schema.middleware.ts";
import { GraphQLContext } from "@/types/index.ts";
import { profileUpdateSchema } from "@/validations/user.validations.ts";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { ProfileInput } from "./auth.resolvers.ts";

@Resolver(() => Profile)
export class ProfileResolvers {
  @Query(() => Profile, { nullable: true })
  @UseMiddleware(protectedUser)
  async profile(@Ctx() { req }: GraphQLContext) {
    return db.profile.findOne({
      where: { user: { id: req.user!.id } },
    });
  }

  @Mutation(() => Profile, { nullable: true })
  @UseMiddleware(protectedUser, validateSchema(profileUpdateSchema))
  async profileUpdate(
    @Ctx() { req }: GraphQLContext,
    @Arg("input", () => ProfileInput) input: ProfileInput,
  ) {
    try {
      const existingProfile = await db.profile.findOne({
        where: { user: { id: req.user!.id } },
      });

      if (!existingProfile) {
        const newProfile = db.profile.create({ ...input });
        newProfile.user = req.user!;
        return newProfile.save();
      }

      await db.profile.update(existingProfile.id, input);
      return db.profile.findOneBy({ id: existingProfile.id });
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
