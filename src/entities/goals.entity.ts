import { Field, Float, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GoalContribution } from "./goal-cntributions.entity.ts";
import { User } from "./users.entity.ts";

@ObjectType()
@Entity("goals")
export class Goal extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => String)
  @Column("text")
  name!: string;

  @Field((type) => Float)
  @Column("decimal")
  targetAmount!: number;

  @Field((type) => Float)
  @Column("decimal")
  currentAmount!: number;

  @Field((type) => String)
  @Column("date")
  targetDate!: Date;

  @ManyToOne(() => User, (user) => user.goals)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToMany(() => GoalContribution, (contribution) => contribution.goal)
  contributions!: GoalContribution[];
}
