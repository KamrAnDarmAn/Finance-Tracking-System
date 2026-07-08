import { Profile } from "@/entities/profiles.entity.ts";
import { UserPreferences } from "@/entities/user-preferences.entity.ts";
import { User } from "@/entities/users.entity.ts";
import { db } from "@/lib/db.ts";
import {
  Arg,
  FieldResolver,
  Mutation,
  Resolver,
  Root,
} from "type-graphql";
import { ProfileInput } from "./auth.resolvers.ts";

@Resolver((_of) => User)
export class UserResolver {
  @FieldResolver(() => Profile, { nullable: true })
  async _profile(@Root() user: User): Promise<Profile | null> {
    const profile = await db.profile.findOne({
      where: { user: { id: user.id } },
    });

    return profile;
  }

  @FieldResolver(() => UserPreferences)
  async _preferences(@Root() user: User): Promise<UserPreferences | null> {
    const preferences = await db.userPreferences.findOneBy({
      user: { id: user.id },
    });
    return preferences;
  }

  @Mutation(() => Profile)
  async profileUpdate(
    @Arg("userId", () => String) userId: string,
    @Arg("profile", () => db.profile) profile: ProfileInput,
  ) {
    const prof = await db.profile.findOneBy({ user: { id: userId } });
    if (!prof) return null;

    const updatedProfile = await db.profile.update(
      { id: prof.id },
      { ...profile },
    );
    return updatedProfile;
  }
}
