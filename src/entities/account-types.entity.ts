import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Account } from "./accounts.entity.ts";

@ObjectType()
@Entity("account_types")
export class AccountType extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => String)
  @Column("text")
  name!: string;

  @Field((type) => String)
  @Column("text")
  description!: string;

  @OneToMany(() => Account, (account) => account.accountType)
  accounts!: Account[];
}
