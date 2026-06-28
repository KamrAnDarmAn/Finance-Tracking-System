import { Field, Float, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Account } from "./accounts.entity.ts";
import { Category } from "./categories.entity.ts";
import { Merchants } from "./merchants.entity.ts";

@ObjectType()
@Entity("recurring_transactions")
export class RecurringTransactions extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("decimal")
  amount!: number;

  @Column("text")
  frequency!: string;

  @Column("date")
  startDate!: Date;

  @Column("date")
  endDate!: Date;

  @Column("date")
  nextOccuenceDate!: Date;

  @ManyToOne(() => Account, (account) => account.recurringTransactions)
  @JoinColumn({ name: "account_id" })
  account!: Account;

  @ManyToOne(() => Category, (category) => category.recurringTransactions)
  @JoinColumn({ name: "category_id" })
  category!: Category;

  @ManyToOne(() => Merchants, (merchant) => merchant.recurringTransactions)
  @JoinColumn({ name: "merchant_id" })
  merchant!: Merchants;
}
