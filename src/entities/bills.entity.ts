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
import { BillPayment } from "./bill-payments.entity.ts";
import { User } from "./users.entity.ts";

@ObjectType()
@Entity("bills")
export class Bill extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => String)
  @Column("text")
  name!: string;

  @Field((type) => Float)
  @Column("decimal")
  amount!: number;

  @Field((type) => String)
  @Column("date")
  dueDate!: Date;

  @Field((type) => String)
  @Column("text")
  frequency!: string;

  @Field((type) => Boolean)
  @Column("boolean")
  isPaid!: boolean;

  @ManyToOne(() => User, (user) => user.bills)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToMany(() => BillPayment, (billPayment) => billPayment.bill)
  billPayments!: BillPayment[];
}
