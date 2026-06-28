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
import { DebtPayment } from "./debt-payment.entity.ts";
import { User } from "./users.entity.ts";

@ObjectType()
@Entity("debts")
export class Debt extends BaseEntity {
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

  @Field(() => Float!)
  @Column("decimal")
  totalAmount!: number;

  @Field(() => Float!)
  @Column("decimal")
  remainingAmount!: number;

  @Field(() => Float!)
  @Column("decimal")
  interestRate!: number;

  @Field(() => String!)
  @Column("date")
  dueDate!: Date;

  @ManyToOne(() => User, (user) => user.debts)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToMany(() => DebtPayment, (debtPayment) => debtPayment.debt)
  debtPayments!: DebtPayment[];
}
