import { db } from "@/lib/db.ts";
import { protectedUser } from "@/middlewares/auth.middleware.ts";
import { validateSchema } from "@/middlewares/validate-schema.middleware.ts";
import { GraphQLContext } from "@/types/index.ts";
import { profileSchema } from "@/validations/user.validations.ts";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { ProfileInput } from "./auth.resolvers.ts";

@Resolver(_of => db.profile)
export class ProfilResolvers {
  @Mutation(() => db.profile, { nullable: true })
  @UseMiddleware(protectedUser)
  @UseMiddleware(validateSchema(profileSchema))
  async profileUpdate(@Ctx() { context }: { context: GraphQLContext },
    @Arg('input', () => ProfileInput) input: ProfileInput
  ) {
    const session = context.req.user;
    console.log('Log 1');

    if (!session)
      return null;

    console.log('Log 2');
    try {
      const user = await db.user.findOneBy({ id: session.userId })
      if (!user) return false;
      const { address, city, country, phone, postalCode } = input;
      const updatedProfile = await db.profile.update(user.profile.id, { address, city, country, phone, postalCode })!

      console.log('Log 3');
      return updatedProfile;
    } catch (error) {

      console.log('Log 4');
      return null;
    }

  }
}
