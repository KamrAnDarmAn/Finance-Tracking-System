import { Field, Float, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Debt } from "./debts.entity.ts";
import { Transaction } from "./transactions.entity.ts";

@ObjectType()
@Entity("debt_payments")
export class DebtPayment extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field(() => String!)
  @Column("date")
  paymentDate!: Date;

  @Field(() => Float!)
  @Column("decimal")
  amount!: number;

  @ManyToOne(() => Debt, (debt) => debt.debtPayments)
  @JoinColumn({ name: "debt_id" })
  debt!: Debt;

  @ManyToOne(() => Transaction, (transaction) => transaction.debtPayments)
  @JoinColumn({ name: "transaction_id" })
  transaction!: Transaction;
}
