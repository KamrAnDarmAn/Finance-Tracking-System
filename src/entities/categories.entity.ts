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
import { RecurringTransactions } from "./recurring-transactions.entity.ts";
import { Subcategory } from "./subcategories.entity.ts";
import { Transaction } from "./transactions.entity.ts";

@ObjectType()
@Entity("categories")
export class Category extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => String)
  @Column("text")
  name!: string;

  @Field((type) => String)
  @Column("text")
  type!: string;

  @Field((type) => String)
  @Column("text")
  color!: string;

  @Field((type) => String)
  @Column("text")
  icon!: string;

  @ManyToOne(() => User, (user) => user.categories)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToMany(() => Subcategory, (subcategory) => subcategory.category)
  subcategories!: Subcategory[];

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions!: Transaction[];

  @OneToMany(() => BudgetCategory, (budgetCategory) => budgetCategory.category)
  budgetCategories!: BudgetCategory[];

  @OneToMany(() => RecurringTransactions, (recurring) => recurring.category)
  recurringTransactions!: RecurringTransactions[];
}
