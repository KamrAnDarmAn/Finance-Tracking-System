import { Account } from "@/entities/accounts.entity.ts";
import { db } from "@/lib/db.ts";
import { protectedUser } from "@/middlewares/auth.middleware.ts";
import { GraphQLContext } from "@/types/index.ts";

import {
  Arg,
  Args,
  ArgsType,
  Authorized,
  Ctx,
  Field,
  InputType,
  Mutation,
  Resolver,
  UseMiddleware,
} from "type-graphql";

@InputType()
class AccountTypeInput {
  @Field(() => String, { nullable: true })
  name!: string;

  @Field(() => String, { nullable: true })
  description!: string;
}

// @ObjectType()
// class AccountPayloadType {
//   errors?: { message: string }[];
//   account?: Account;
// }

@ArgsType()
class AccountArgs {
  @Field(() => String, { nullable: true })
  name!: string;

  @Field(() => String, { nullable: true })
  balance!: string;

  @Field(() => String, { nullable: true })
  supportPhone!: string;

  @Field(() => String, { nullable: true })
  isActive!: boolean;

  @Field(() => String)
  type!: string;
}

@Resolver((_of) => Account)
export class AccountResolver {
  @Mutation(() => Account)
  @Authorized()
  async accountAdd(
    @Ctx() { context }: { context: GraphQLContext },
    @Args(() => AccountArgs) { name, balance, isActive, supportPhone }: AccountArgs,
    @Arg('type', () => AccountTypeInput) { name: accountTypeName, description }: AccountTypeInput
  ) {
    const session = await context.req.user;
    if (!session) return;

    const account = db.account.create({ name, balance, isActive, supportPhone });

    const accountType = db.accountType.create({ name: accountTypeName, description })
    console.log(account, accountType)

    account.save();
    accountType.save();
    return account;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(protectedUser)
  async accountRemove(@Arg('id', () => String) id: string) {
    try {
      const account = await db.account.findOneBy({ id })
      if (!account)
        return false;
      db.account.delete({ id })
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(protectedUser)
  async accountUpdate(
    @Ctx() { context }: { context: GraphQLContext },
    @Arg('postId', () => String) postId: string,
    @Arg('userId', () => String) userId: string,
    // @Arg('input', () => AccountArgs) input: AccountArgs
  ) {

    console.log(context, postId, userId);
    return false;
  }
}
