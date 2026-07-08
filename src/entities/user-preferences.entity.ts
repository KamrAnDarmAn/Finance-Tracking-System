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

  @Field((type) => String, { defaultValue: "light" })
  @Column("text", { default: "light" })
  theme!: string;

  @Field((type) => String, { defaultValue: "en" })
  @Column("text", { default: "en" })
  language!: string;

  @Field((type) => Boolean, { defaultValue: false })
  @Column("boolean", { default: false })
  receiveEmailNotification!: boolean;

  @Field(() => UserPreferences)
  preferencesUpdate!: UserPreferences;

  @OneToOne(() => User, (user) => user.preferences)
  @JoinColumn({ name: "user_id" })
  user!: User;
}
