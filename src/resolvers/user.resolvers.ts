import { Profile } from "@/entities/profiles.entity.ts";
import { UserPreferences } from "@/entities/user-preferences.entity.ts";
import { User } from "@/entities/users.entity.ts";
import { db } from "@/lib/db.ts";
import { FieldResolver, Resolver, Root } from "type-graphql";

@Resolver(() => User)
export class UserResolver {
  @FieldResolver(() => Profile, { nullable: true })
  async _profile(@Root() user: User): Promise<Profile | null> {
    if (user.profile) {
      return user.profile;
    }

    return db.profile.findOne({
      where: { user: { id: user.id } },
    });
  }

  @FieldResolver(() => UserPreferences, { nullable: true })
  async _preferences(@Root() user: User): Promise<UserPreferences | null> {
    if (user.preferences) {
      return user.preferences;
    }

    return db.userPreferences.findOne({
      where: { user: { id: user.id } },
    });
  }
}
