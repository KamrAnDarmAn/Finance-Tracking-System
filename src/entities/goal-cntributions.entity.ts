import { Field, Float, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Goal } from "./goals.entity.ts";
import { Transaction } from "./transactions.entity.ts";

@ObjectType()
@Entity("goal_contributions")
export class GoalContribution extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => Float)
  @Column("decimal")
  amount!: number;

  @Field((type) => String)
  @Column("date")
  contributionDate!: Date;

  @ManyToOne(() => Goal, (goal) => goal.contributions)
  @JoinColumn({ name: "goal_id" })
  goal!: Goal;

  @ManyToOne(() => Transaction, (transaction) => transaction.goalContributions)
  @JoinColumn({ name: "transaction_id" })
  transaction!: Transaction;
}
