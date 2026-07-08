import { Currency } from "@/entities/currencies.entity.ts";
import { db } from "@/lib/db.ts";
import { protectedUser } from "@/middlewares/auth.middleware.ts";
import { validateSchema } from "@/middlewares/validate-schema.middleware.ts";
import {
  currencyCreateSchema,
  currencyUpdateSchema,
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
class CurrencyInput {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  code!: string;

  @Field(() => String)
  symbol!: string;
}

@InputType()
class CurrencyUpdateInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  code?: string;

  @Field(() => String, { nullable: true })
  symbol?: string;
}

async function findCurrencyByCode(code: string, excludeId?: string) {
  const existing = await db.currency.findOneBy({ code });
  if (existing && existing.id !== excludeId) {
    throw new GraphQLError("A currency with this code already exists.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
}

@Resolver(() => Currency)
export class CurrencyResolvers {
  @Query(() => [Currency])
  @UseMiddleware(protectedUser)
  async currencies() {
    return db.currency.find({ order: { code: "ASC" } });
  }

  @Query(() => Currency, { nullable: true })
  @UseMiddleware(protectedUser, validateSchema(idSchema))
  async currency(@Arg("id", () => String) id: string) {
    return db.currency.findOneBy({ id });
  }

  @Mutation(() => Currency)
  @UseMiddleware(protectedUser, validateSchema(currencyCreateSchema))
  async currencyAdd(@Arg("input", () => CurrencyInput) input: CurrencyInput) {
    const code = input.code.toUpperCase();
    await findCurrencyByCode(code);

    const currency = db.currency.create({
      name: input.name,
      code,
      symbol: input.symbol,
    });
    return currency.save();
  }

  @Mutation(() => Currency, { nullable: true })
  @UseMiddleware(protectedUser, validateSchema(currencyUpdateSchema))
  async currencyUpdate(
    @Arg("id", () => String) id: string,
    @Arg("input", () => CurrencyUpdateInput) input: CurrencyUpdateInput,
  ) {
    const currency = await db.currency.findOneBy({ id });
    if (!currency) {
      throw new GraphQLError("Currency not found.", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    if (input.name !== undefined) currency.name = input.name;
    if (input.code !== undefined) {
      const code = input.code.toUpperCase();
      await findCurrencyByCode(code, id);
      currency.code = code;
    }
    if (input.symbol !== undefined) currency.symbol = input.symbol;

    return currency.save();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(protectedUser, validateSchema(idSchema))
  async currencyRemove(@Arg("id", () => String) id: string) {
    const currency = await db.currency.findOneBy({ id });
    if (!currency) {
      return false;
    }

    const accountsUsing = await db.account.count({
      where: { currency: { id } },
    });
    const usersUsing = await db.user.count({
      where: { currency: { id } },
    });
    if (accountsUsing > 0 || usersUsing > 0) {
      throw new GraphQLError(
        "Cannot delete currency because it is linked to existing accounts or users.",
        { extensions: { code: "BAD_USER_INPUT" } },
      );
    }

    await db.currency.remove(currency);
    return true;
  }
}
