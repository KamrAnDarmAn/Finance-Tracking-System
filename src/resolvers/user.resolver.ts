import { Profile } from "@/entities/profiles.entity.ts";
import { User } from "@/entities/users.entity.ts";
import { db } from "@/lib/db.ts";
import { FieldResolver, Resolver, Root } from "type-graphql";

@Resolver((of) => User)
export class UserResolver {
  @FieldResolver(() => Profile, { nullable: true })
  async _profile(@Root() user: User): Promise<Profile | null> {
    const profile = await db.profile.findOne({
      where: { user: { id: user.id } },
    });

    return profile;
  }
}
