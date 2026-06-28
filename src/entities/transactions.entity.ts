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
import { BillPayment } from "./bill-payments.entity.ts";
import { Category } from "./categories.entity.ts";
import { DebtPayment } from "./debt-payment.entity.ts";
import { GoalContribution } from "./goal-cntributions.entity.ts";
import { Merchants } from "./merchants.entity.ts";
import { Receipt } from "./receipts.entity.ts";
import { Subcategory } from "./subcategories.entity.ts";
import { TransactionTag } from "./transaction-tags.entity.ts";
import { Transfer } from "./transfers.entity.ts";

@ObjectType()
@Entity("transactions")
export class Transaction extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => Float)
  @Column("decimal")
  amount!: number;

  @Field((type) => String)
  @Column("date")
  transactionDate!: Date;

  @Field(() => String!)
  @Column("text")
  notes!: string;

  @Field(() => Boolean!)
  @Column("boolean")
  isPending!: boolean;

  @ManyToOne(() => Account, (account) => account.transactions)
  @JoinColumn({ name: "account_id" })
  account!: Account;

  @ManyToOne(() => Category, (category) => category.transactions)
  @JoinColumn({ name: "category_id" })
  category!: Category;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.transactions)
  @JoinColumn({ name: "subcategory_id" })
  subcategory!: Subcategory;

  @ManyToOne(() => Merchants, (merchant) => merchant.transactions)
  @JoinColumn({ name: "merchant_id" })
  merchant!: Merchants;

  @OneToMany(() => BillPayment, (billPayment) => billPayment.transaction)
  billPayments!: BillPayment[];

  @OneToMany(() => DebtPayment, (debtPayment) => debtPayment.transaction)
  debtPayments!: DebtPayment[];

  @OneToMany(
    () => GoalContribution,
    (goalContribution) => goalContribution.transaction,
  )
  goalContributions!: GoalContribution[];

  @OneToMany(() => Receipt, (receipt) => receipt.transaction)
  receipts!: Receipt[];

  @OneToMany(() => TransactionTag, (transactionTag) => transactionTag.transaction)
  transactionTags!: TransactionTag[];

  @OneToMany(() => Transfer, (transfer) => transfer.sourceTransaction)
  outgoingTransfers!: Transfer[];

  @OneToMany(() => Transfer, (transfer) => transfer.destinationTransaction)
  incomingTransfers!: Transfer[];
}
