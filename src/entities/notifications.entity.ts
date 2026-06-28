import { Field, ObjectType } from "type-graphql";
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
@Entity("notifications")
export class Notification extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => String)
  @Column("text")
  title!: string;

  @Field((type) => String)
  @Column("text")
  message!: string;

  @Field((type) => Boolean)
  @Column("boolean")
  isRead!: boolean;

  @Field(() => String!)
  @Column("timestamp")
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: "user_id" })
  user!: User;
}
