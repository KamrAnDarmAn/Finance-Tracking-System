import { Field, Float, ObjectType } from "type-graphql";
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
@Entity("transfers")
export class Transfer extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => Float)
  @Column("decimal")
  fee!: number;

  @ManyToOne(() => Transaction, (transaction) => transaction.outgoingTransfers)
  @JoinColumn({ name: "source_transaction_id" })
  sourceTransaction!: Transaction;

  @ManyToOne(() => Transaction, (transaction) => transaction.incomingTransfers)
  @JoinColumn({ name: "destination_transaction_id" })
  destinationTransaction!: Transaction;
}
