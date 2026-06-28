import { Field, Float, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Bill } from "./bills.entity.ts";
import { Transaction } from "./transactions.entity.ts";

@ObjectType()
@Entity("bill_payments")
export class BillPayment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field(() => String!)
  @Column("date")
  paymentDate!: Date;

  @Field(() => Float!)
  @Column("decimal")
  amountPaid!: number;

  @ManyToOne(() => Bill, (bill) => bill.billPayments)
  @JoinColumn({ name: "bill_id" })
  bill!: Bill;

  @ManyToOne(() => Transaction, (transaction) => transaction.billPayments)
  @JoinColumn({ name: "transaction_id" })
  transaction!: Transaction;
}
