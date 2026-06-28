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
import { TransactionTag } from "./transaction-tags.entity.ts";
import { User } from "./users.entity.ts";

@ObjectType()
@Entity("tags")
export class Tag extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => String)
  @Column("text")
  name!: string;

  @Field((type) => String)
  @Column("text")
  color!: string;

  @ManyToOne(() => User, (user) => user.tags)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToMany(() => TransactionTag, (transactionTag) => transactionTag.tag)
  transactionTags!: TransactionTag[];
}
