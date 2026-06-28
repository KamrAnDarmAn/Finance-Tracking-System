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

  @Field()
  @Column("text")
  phone!: string;

  @Field()
  @Column("text")
  address!: string;

  @Field()
  @Column("text")
  city!: string;

  @Field()
  @Column("text")
  county!: string;

  @Field()
  @Column("text")
  postalCode!: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: "user_id" })
  user!: User;
}
