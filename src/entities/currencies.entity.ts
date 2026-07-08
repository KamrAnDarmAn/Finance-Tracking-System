import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Account } from "./accounts.entity.ts";
import { ExchangeRate } from "./exchange-rates.entity.ts";
import { User } from "./users.entity.ts";

@ObjectType()
@Entity("currencies")
export class Currency extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field(() => String)
  @Column("text")
  name!: string;

  @Field(() => String)
  @Column("text")
  code!: string;

  @Field(() => String)
  @Column("text")
  symbol!: string;

  @OneToMany(() => User, (user) => user.currency)
  users!: User[];

  @OneToMany(() => Account, (account) => account.currency)
  accounts!: Account[];

  @OneToMany(() => ExchangeRate, (exchangeRate) => exchangeRate.fromCurrency)
  exchangeRatesFrom!: ExchangeRate[];

  @OneToMany(() => ExchangeRate, (exchangeRate) => exchangeRate.toCurrency)
  exchangeRatesTo!: ExchangeRate[];
}
