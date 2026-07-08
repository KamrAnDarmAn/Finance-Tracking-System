import { Institution } from "@/entities/institutions.entity.ts";
import { db } from "@/lib/db.ts";
import { protectedUser } from "@/middlewares/auth.middleware.ts";
import { validateSchema } from "@/middlewares/validate-schema.middleware.ts";
import {
  idSchema,
  institutionCreateSchema,
  institutionUpdateSchema,
} from "@/validations/reference-data.validation.ts";
import { GraphQLError } from "graphql";
import {
  Arg,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";

@InputType()
class InstitutionInput {
  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  website?: string;

  @Field(() => String, { nullable: true })
  supportPhone?: string;
}

@InputType()
class InstitutionUpdateInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  website?: string;

  @Field(() => String, { nullable: true })
  supportPhone?: string;
}

@Resolver(() => Institution)
export class InstitutionResolvers {
  @Query(() => [Institution])
  @UseMiddleware(protectedUser)
  async institutions() {
    return db.institution.find({ order: { name: "ASC" } });
  }

  @Query(() => Institution, { nullable: true })
  @UseMiddleware(protectedUser, validateSchema(idSchema))
  async institution(@Arg("id", () => String) id: string) {
    return db.institution.findOneBy({ id });
  }

  @Mutation(() => Institution)
  @UseMiddleware(protectedUser, validateSchema(institutionCreateSchema))
  async institutionAdd(@Arg("input", () => InstitutionInput) input: InstitutionInput) {
    const institution = db.institution.create({
      name: input.name,
      website: input.website ?? "",
      supportPhone: input.supportPhone ?? "",
    });
    return institution.save();
  }

  @Mutation(() => Institution, { nullable: true })
  @UseMiddleware(protectedUser, validateSchema(institutionUpdateSchema))
  async institutionUpdate(
    @Arg("id", () => String) id: string,
    @Arg("input", () => InstitutionUpdateInput) input: InstitutionUpdateInput,
  ) {
    const institution = await db.institution.findOneBy({ id });
    if (!institution) {
      throw new GraphQLError("Institution not found.", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    if (input.name !== undefined) institution.name = input.name;
    if (input.website !== undefined) institution.website = input.website;
    if (input.supportPhone !== undefined) {
      institution.supportPhone = input.supportPhone;
    }

    return institution.save();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(protectedUser, validateSchema(idSchema))
  async institutionRemove(@Arg("id", () => String) id: string) {
    const institution = await db.institution.findOneBy({ id });
    if (!institution) {
      return false;
    }

    const inUse = await db.account.count({
      where: { institution: { id } },
    });
    if (inUse > 0) {
      throw new GraphQLError(
        "Cannot delete institution because it is linked to existing accounts.",
        { extensions: { code: "BAD_USER_INPUT" } },
      );
    }

    await db.institution.remove(institution);
    return true;
  }
}
