import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Investment } from "./investments.entity.ts";

@ObjectType()
@Entity("investment_types")
export class InvestmentType extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => String)
  @Column("text")
  name!: string;

  @Field((type) => String)
  @Column("text")
  description!: string;

  @OneToMany(() => Investment, (investment) => investment.investmentType)
  investments!: Investment[];
}
