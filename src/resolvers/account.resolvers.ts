import { Account } from "@/entities/accounts.entity.ts";
import { Institution } from "@/entities/institutions.entity.ts";
import { db } from "@/lib/db.ts";
import { protectedUser } from "@/middlewares/auth.middleware.ts";
import { validateSchema } from "@/middlewares/validate-schema.middleware.ts";
import { GraphQLContext } from "@/types/index.ts";
import {
  accountCreateSchema,
  accountIdSchema,
  accountUpdateSchema,
} from "@/validations/account.validation.ts";
import { GraphQLError } from "graphql";
import {
  Arg,
  Ctx,
  Field,
  Float,
  InputType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";

const accountRelations = {
  accountType: true,
  institution: true,
  currency: true,
} as const;

async function findOwnedAccount(userId: string, accountId: string) {
  return db.account.findOne({
    where: { id: accountId, user: { id: userId } },
    relations: accountRelations,
  });
}

async function resolveAccountReferences(input: {
  accountTypeId: string;
  currencyId: string;
  institutionId?: string | null;
}) {
  const accountType = await db.accountType.findOneBy({
    id: input.accountTypeId,
  });
  if (!accountType) {
    throw new GraphQLError("Account type not found.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const currency = await db.currency.findOneBy({ id: input.currencyId });
  if (!currency) {
    throw new GraphQLError("Currency not found.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  let institution: Institution | null = null;
  if (input.institutionId) {
    institution = await db.institution.findOneBy({ id: input.institutionId });
    if (!institution) {
      throw new GraphQLError("Institution not found.", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }
  }

  return { accountType, currency, institution };
}

@InputType()
class AccountInput {
  @Field(() => String)
  name!: string;

  @Field(() => Float, { nullable: true })
  balance?: number;

  @Field(() => String, { nullable: true })
  supportPhone?: string;

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  isActive?: boolean;

  @Field(() => String)
  accountTypeId!: string;

  @Field(() => String, { nullable: true })
  institutionId?: string;

  @Field(() => String)
  currencyId!: string;
}

@InputType()
class AccountUpdateInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Float, { nullable: true })
  balance?: number;

  @Field(() => String, { nullable: true })
  supportPhone?: string;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field(() => String, { nullable: true })
  accountTypeId?: string;

  @Field(() => String, { nullable: true })
  institutionId?: string;

  @Field(() => String, { nullable: true })
  currencyId?: string;
}

@Resolver(() => Account)
export class AccountResolver {
  @Query(() => [Account])
  @UseMiddleware(protectedUser)
  async accounts(@Ctx() { req }: GraphQLContext) {
    return db.account.find({
      where: { user: { id: req.user!.id } },
      relations: accountRelations,
      order: { name: "ASC" },
    });
  }

  @Query(() => Account, { nullable: true })
  @UseMiddleware(protectedUser, validateSchema(accountIdSchema))
  async account(
    @Ctx() { req }: GraphQLContext,
    @Arg("id", () => String) id: string,
  ) {
    return findOwnedAccount(req.user!.id, id);
  }

  @Mutation(() => Account)
  @UseMiddleware(protectedUser, validateSchema(accountCreateSchema))
  async accountAdd(
    @Ctx() { req }: GraphQLContext,
    @Arg("input", () => AccountInput) input: AccountInput,
  ) {
    const { accountType, currency, institution } =
      await resolveAccountReferences(input);

    const account = db.account.create({
      name: input.name,
      balance: String(input.balance ?? 0),
      supportPhone: input.supportPhone ?? "",
      isActive: input.isActive ?? true,
      accountType,
      currency,
      institution: institution ?? null,
      user: req.user!,
    });

    await account.save();

    return findOwnedAccount(req.user!.id, account.id);
  }

  @Mutation(() => Account, { nullable: true })
  @UseMiddleware(protectedUser, validateSchema(accountUpdateSchema))
  async accountUpdate(
    @Ctx() { req }: GraphQLContext,
    @Arg("id", () => String) id: string,
    @Arg("input", () => AccountUpdateInput) input: AccountUpdateInput,
  ) {
    const account = await findOwnedAccount(req.user!.id, id);
    if (!account) {
      throw new GraphQLError("Account not found.", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    if (input.name !== undefined) account.name = input.name;
    if (input.balance !== undefined) account.balance = String(input.balance);
    if (input.supportPhone !== undefined) account.supportPhone = input.supportPhone;
    if (input.isActive !== undefined) account.isActive = input.isActive;

    if (
      input.accountTypeId ||
      input.currencyId ||
      input.institutionId !== undefined
    ) {
      const refs = await resolveAccountReferences({
        accountTypeId: input.accountTypeId ?? account.accountType.id,
        currencyId: input.currencyId ?? account.currency.id,
        institutionId:
          input.institutionId !== undefined
            ? input.institutionId
            : account.institution?.id,
      });

      account.accountType = refs.accountType;
      account.currency = refs.currency;
      account.institution = refs.institution;
    }

    await account.save();
    return findOwnedAccount(req.user!.id, account.id);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(protectedUser, validateSchema(accountIdSchema))
  async accountRemove(
    @Ctx() { req }: GraphQLContext,
    @Arg("id", () => String) id: string,
  ) {
    const account = await findOwnedAccount(req.user!.id, id);
    if (!account) {
      return false;
    }

    await db.account.remove(account);
    return true;
  }
}
