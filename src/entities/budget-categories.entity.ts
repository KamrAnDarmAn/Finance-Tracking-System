import { Field, Float, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Budget } from "./budgets.entity.ts";
import { Category } from "./categories.entity.ts";

@ObjectType()
@Entity("budget_categories")
export class BudgetCategory extends BaseEntity {
  @Field((type) => String)
  @PrimaryColumn("uuid")
  budgetId!: string;

  @Field((type) => String)
  @PrimaryColumn("uuid")
  categoryId!: string;

  @Field((type) => Float)
  @Column("decimal")
  allocatedAmount!: number;

  @ManyToOne(() => Budget, (budget) => budget.budgetCategories, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "budget_id" })
  budget!: Budget;

  @ManyToOne(() => Category, (category) => category.budgetCategories, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "category_id" })
  category!: Category;
}
