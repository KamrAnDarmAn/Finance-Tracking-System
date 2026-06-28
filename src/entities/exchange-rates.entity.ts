import { Field, Float, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Currency } from "./currencies.entity.ts";

@ObjectType()
@Entity("exchange_rates")
export class ExchangeRate extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => Float)
  @Column("decimal")
  rate!: number;

  @Column("date")
  rateDate!: Date;

  @ManyToOne(() => Currency, (currency) => currency.exchangeRatesFrom)
  @JoinColumn({ name: "from_currency_id" })
  fromCurrency!: Currency;

  @ManyToOne(() => Currency, (currency) => currency.exchangeRatesTo)
  @JoinColumn({ name: "to_currency_id" })
  toCurrency!: Currency;
}
