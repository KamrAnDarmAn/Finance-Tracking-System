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
@Entity("institutions")
export class Institution extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => String)
  @Column("text")
  name!: string;

  @Field((type) => String)
  @Column("text")
  website!: string;

  @Field((type) => String)
  @Column("text")
  supportPhone!: string;

  @OneToMany(() => Account, (account) => account.institution)
  accounts!: Account[];
}
