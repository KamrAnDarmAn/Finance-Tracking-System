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

@Entity("currencies")
export class Currency extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("text")
  name!: string;

  @Column("text")
  code!: string;

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
