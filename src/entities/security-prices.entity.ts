import { Field, Float, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ForeignKey,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Transaction } from "./transactions.entity.ts";

@ObjectType()
@Entity("security_prices")
export class SecurityPrices extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => String)
  @Column("text")
  tickerSymbol!: string;

  @Field((type) => Float)
  @Column("decimal")
  price!: number;

  @Field((type) => String)
  @Column("date")
  priceDate!: Date;
}
