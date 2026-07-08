import { Field, Float, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AccountType } from "./account-types.entity.ts";
import { Currency } from "./currencies.entity.ts";
import { Institution } from "./institutions.entity.ts";
import { Investment } from "./investments.entity.ts";
import { RecurringTransactions } from "./recurring-transactions.entity.ts";
import { Transaction } from "./transactions.entity.ts";
import { User } from "./users.entity.ts";

@ObjectType()
@Entity("accounts")
export class Account extends BaseEntity {
  @Field((_type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((_type) => String)
  @Column("text")
  name!: string;

  @Field((_type) => Float)
  @Column("decimal")
  balance!: string;

  @Field((_type) => String)
  @Column("text")
  supportPhone!: string;

  @Field(() => Boolean)
  @Column("boolean")
  isActive!: boolean;

  @Field(() => AccountType)
  @ManyToOne(() => AccountType, (accountType) => accountType.accounts)
  @JoinColumn({ name: "account_type_id" })
  accountType!: AccountType;

  @Field(() => Institution, { nullable: true })
  @ManyToOne(() => Institution, (institution) => institution.accounts, {
    nullable: true,
  })
  @JoinColumn({ name: "institution_id" })
  institution?: Institution | null;

  @Field(() => Currency)
  @ManyToOne(() => Currency, (currency) => currency.accounts)
  @JoinColumn({ name: "currency_id" })
  currency!: Currency;

  @ManyToOne(() => User, (user) => user.accounts)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions!: Transaction[];

  @OneToMany(() => RecurringTransactions, (recurring) => recurring.account)
  recurringTransactions!: RecurringTransactions[];

  @OneToMany(() => Investment, (investment) => investment.account)
  investments!: Investment[];
}
