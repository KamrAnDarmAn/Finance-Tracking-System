import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Investment } from "./investments.entity.ts";

@ObjectType()
@Entity("inverstment_transactions")
export class InverstmentTrasaction extends BaseEntity {
  @Field((type) => String)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => String)
  @Column("text")
  transactionType!: string;

  @Column("text")
  @Field((type) => String)
  shares!: string;

  @Column("decimal")
  @Field((type) => String)
  pricePerShare!: string;

  @Column("decimal")
  @Field((type) => String)
  commission!: string;

  @Field((type) => String)
  @Column("date")
  transactionDate!: Date;

  @ManyToOne(() => Investment, (investment) => investment.investmentTransactions)
  @JoinColumn({ name: "investment_id" })
  investment!: Investment;
}
