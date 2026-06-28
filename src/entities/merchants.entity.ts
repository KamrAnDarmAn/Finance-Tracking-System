import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RecurringTransactions } from "./recurring-transactions.entity.ts";
import { Transaction } from "./transactions.entity.ts";
import { User } from "./users.entity.ts";

@ObjectType()
@Entity("merchants")
export class Merchants extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => String)
  @Column("text")
  name!: string;

  @Field((type) => String)
  @Column("text")
  website!: string;

  @ManyToOne(() => User, (user) => user.merchants)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToMany(() => Transaction, (transaction) => transaction.merchant)
  transactions!: Transaction[];

  @OneToMany(() => RecurringTransactions, (recurring) => recurring.merchant)
  recurringTransactions!: RecurringTransactions[];
}
