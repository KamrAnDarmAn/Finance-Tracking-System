import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Tag } from "./tags.entity.ts";
import { Transaction } from "./transactions.entity.ts";

@ObjectType()
@Entity("transaction_tags")
export class TransactionTag extends BaseEntity {
  @Field((type) => String)
  @PrimaryColumn("uuid")
  transactionId!: string;

  @Field((type) => String)
  @PrimaryColumn("uuid")
  tagId!: string;

  @ManyToOne(() => Transaction, (transaction) => transaction.transactionTags, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "transaction_id" })
  transaction!: Transaction;

  @ManyToOne(() => Tag, (tag) => tag.transactionTags, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tag_id" })
  tag!: Tag;
}
