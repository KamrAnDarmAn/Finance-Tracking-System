import { Field, Float, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./users.entity.ts";
import { BudgetCategory } from "./budget-categories.entity.ts";

@ObjectType()
@Entity("budgets")
export class Budget extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field(() => String!)
  @Column("text")
  name!: string;

  @Field(() => Float!)
  @Column("decimal")
  amount!: number;

  @Field(() => String!)
  @Column("date")
  startDate!: Date;

  @Field(() => String!)
  @Column("date")
  endDate!: Date;

  @Field(() => String!)
  @Column("text")
  period!: string;

  @ManyToOne(() => User, (user) => user.budgets)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToMany(() => BudgetCategory, (budgetCategory) => budgetCategory.budget)
  budgetCategories!: BudgetCategory[];
}
