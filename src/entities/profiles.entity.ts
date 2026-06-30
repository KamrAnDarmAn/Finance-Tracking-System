import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ForeignKey,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./users.entity.ts";

@ObjectType()
@Entity("profiles")
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field(() => String, { nullable: true })
  @Column("text", { nullable: true })
  phone!: string;

  @Field(() => String, { nullable: true })
  @Column("text", { nullable: true })
  address!: string;

  @Field(() => String, { nullable: true })
  @Column("text", { nullable: true })
  city!: string;

  @Field(() => String, { nullable: true })
  @Column("text", { nullable: true })
  country!: string;

  @Field(() => String, { nullable: true })
  @Column("text", { nullable: true })
  postalCode!: string;

  // @ForeignKey(() => String)
  // userId!: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: "user_id" })
  user!: User;
}
