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
import { Category } from "./categories.entity.ts";
import { Transaction } from "./transactions.entity.ts";

@ObjectType()
@Entity("subcategories")
export class Subcategory extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => String)
  @Column("text")
  name!: string;

  @ManyToOne(() => Category, (category) => category.subcategories)
  @JoinColumn({ name: "category_id" })
  category!: Category;

  @OneToMany(() => Transaction, (transaction) => transaction.subcategory)
  transactions!: Transaction[];
}
