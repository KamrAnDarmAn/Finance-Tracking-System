import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Transaction } from "./transactions.entity.ts";

@ObjectType()
@Entity("receipts")
export class Receipt extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => String)
  @Column("text")
  filePath!: string;

  @Field((type) => Int)
  @Column("int")
  fileSize!: number;

  @Field((type) => String)
  @Column("timestamp")
  uploadedAt!: Date;

  @ManyToOne(() => Transaction, (transaction) => transaction.receipts)
  @JoinColumn({ name: "transaction_id" })
  transaction!: Transaction;
}
