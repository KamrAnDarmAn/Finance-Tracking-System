import { AccountType } from "@/entities/account-types.entity.ts";
import { db } from "@/lib/db.ts";
import { protectedUser } from "@/middlewares/auth.middleware.ts";
import { validateSchema } from "@/middlewares/validate-schema.middleware.ts";
import {
  accountTypeCreateSchema,
  accountTypeUpdateSchema,
  idSchema,
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
class AccountTypeInput {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  description!: string;
}

@InputType()
class AccountTypeUpdateInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;
}

async function findAccountTypeByName(name: string, excludeId?: string) {
  const existing = await db.accountType.findOneBy({ name });
  if (existing && existing.id !== excludeId) {
    throw new GraphQLError("An account type with this name already exists.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
}

@Resolver(() => AccountType)
export class AccountTypeResolvers {
  @Query(() => [AccountType])
  @UseMiddleware(protectedUser)
  async accountTypes() {
    return db.accountType.find({ order: { name: "ASC" } });
  }

  @Query(() => AccountType, { nullable: true })
  @UseMiddleware(protectedUser, validateSchema(idSchema))
  async accountType(@Arg("id", () => String) id: string) {
    return db.accountType.findOneBy({ id });
  }

  @Mutation(() => AccountType)
  @UseMiddleware(protectedUser, validateSchema(accountTypeCreateSchema))
  async accountTypeAdd(@Arg("input", () => AccountTypeInput) input: AccountTypeInput) {
    await findAccountTypeByName(input.name);

    const accountType = db.accountType.create({
      name: input.name,
      description: input.description,
    });
    return accountType.save();
  }

  @Mutation(() => AccountType, { nullable: true })
  @UseMiddleware(protectedUser, validateSchema(accountTypeUpdateSchema))
  async accountTypeUpdate(
    @Arg("id", () => String) id: string,
    @Arg("input", () => AccountTypeUpdateInput) input: AccountTypeUpdateInput,
  ) {
    const accountType = await db.accountType.findOneBy({ id });
    if (!accountType) {
      throw new GraphQLError("Account type not found.", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    if (input.name !== undefined) {
      await findAccountTypeByName(input.name, id);
      accountType.name = input.name;
    }
    if (input.description !== undefined) {
      accountType.description = input.description;
    }

    return accountType.save();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(protectedUser, validateSchema(idSchema))
  async accountTypeRemove(@Arg("id", () => String) id: string) {
    const accountType = await db.accountType.findOneBy({ id });
    if (!accountType) {
      return false;
    }

    const inUse = await db.account.count({
      where: { accountType: { id } },
    });
    if (inUse > 0) {
      throw new GraphQLError(
        "Cannot delete account type because it is linked to existing accounts.",
        { extensions: { code: "BAD_USER_INPUT" } },
      );
    }

    await db.accountType.remove(accountType);
    return true;
  }
}
