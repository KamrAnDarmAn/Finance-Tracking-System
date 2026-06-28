import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./users.entity.ts";

@ObjectType()
@Entity("user_preferences")
export class UserPreferences extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => String)
  @Column("text")
  theme!: string;

  @Field((type) => String)
  @Column("text")
  language!: string;

  @Field((type) => Boolean)
  @Column("boolean")
  receiveEmailNotification!: boolean;

  @OneToOne(() => User, (user) => user.preferences)
  @JoinColumn({ name: "user_id" })
  user!: User;
}
