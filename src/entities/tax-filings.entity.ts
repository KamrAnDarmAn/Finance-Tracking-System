import { Field, Float, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./users.entity.ts";

@ObjectType()
@Entity("tax_filings")
export class TaxFiling extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => String)
  @Column("integer")
  taxYear!: number;

  @Field((type) => String)
  @Column("text")
  filingStatus!: string;

  @Field((type) => Float)
  @Column("decimal")
  totalIncome!: number;

  @Field((type) => Float)
  @Column("decimal")
  totalDeductions!: number;

  @Field((type) => Float)
  @Column("decimal")
  taxOwed!: number;

  @ManyToOne(() => User, (user) => user.taxFilings)
  @JoinColumn({ name: "user_id" })
  user!: User;
}
