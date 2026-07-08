import { UserPreferences } from "@/entities/user-preferences.entity.ts";
import { db } from "@/lib/db.ts";
import { protectedUser } from "@/middlewares/auth.middleware.ts";
import { validateSchema } from "@/middlewares/validate-schema.middleware.ts";
import { GraphQLContext } from "@/types/index.ts";
import { preferencesUpdateSchema } from "@/validations/user.validations.ts";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";

@InputType()
export class PreferencesInput {
  @Field(() => String, { nullable: true })
  theme?: string;

  @Field(() => String, { nullable: true })
  language?: string;

  @Field(() => Boolean, { nullable: true })
  receiveEmailNotification?: boolean;
}

@Resolver(() => UserPreferences)
export class PreferencesResolvers {
  @Query(() => UserPreferences, { nullable: true })
  @UseMiddleware(protectedUser)
  async preferences(@Ctx() { req }: GraphQLContext) {
    return db.userPreferences.findOne({
      where: { user: { id: req.user!.id } },
    });
  }

  @Mutation(() => UserPreferences, { nullable: true })
  @UseMiddleware(protectedUser, validateSchema(preferencesUpdateSchema))
  async preferencesUpdate(
    @Ctx() { req }: GraphQLContext,
    @Arg("input", () => PreferencesInput) input: PreferencesInput,
  ) {
    try {
      const existingPreferences = await db.userPreferences.findOne({
        where: { user: { id: req.user!.id } },
      });

      if (!existingPreferences) {
        const newPreferences = db.userPreferences.create({ ...input });
        newPreferences.user = req.user!;
        return newPreferences.save();
      }

      await db.userPreferences.update(existingPreferences.id, input);
      return db.userPreferences.findOneBy({ id: existingPreferences.id });
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
