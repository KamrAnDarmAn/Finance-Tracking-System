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
import { Account } from "./accounts.entity.ts";
import { InvestmentType } from "./investment-types.entity.ts";
import { InverstmentTrasaction } from "./investment-transactions.entity.ts";

@ObjectType()
@Entity("investments")
export class Investment extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => String)
  @Column("text")
  trickerSymbol!: string;

  @Field((type) => String)
  @Column("text")
  name!: string;

  @Field((type) => Float)
  @Column("decimal")
  shares!: number;

  @Column("decimal")
  @Field((type) => Float)
  costBasis!: number;

  @ManyToOne(() => Account, (account) => account.investments)
  @JoinColumn({ name: "account_id" })
  account!: Account;

  @ManyToOne(
    () => InvestmentType,
    (investmentType) => investmentType.investments,
  )
  @JoinColumn({ name: "investment_type_id" })
  investmentType!: InvestmentType;

  @OneToMany(
    () => InverstmentTrasaction,
    (investmentTransaction) => investmentTransaction.investment,
  )
  investmentTransactions!: InverstmentTrasaction[];
}
