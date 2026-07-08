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
  @Column("integer", { nullable: true })
  postalCode!: number;

  // @ForeignKey(() => String)
  // userId!: string;

  @Field(() => Profile)
  profileUpdate!: Profile;

  @OneToOne(() => User, (user) => user.profile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;
}
