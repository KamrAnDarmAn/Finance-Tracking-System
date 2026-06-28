import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Account } from "./accounts.entity.ts";
import { AuditLogs } from "./audit-logs.entity.ts";
import { Bill } from "./bills.entity.ts";
import { Budget } from "./budgets.entity.ts";
import { Category } from "./categories.entity.ts";
import { Currency } from "./currencies.entity.ts";
import { Debt } from "./debts.entity.ts";
import { Goal } from "./goals.entity.ts";
import { Merchants } from "./merchants.entity.ts";
import { Notification } from "./notifications.entity.ts";
import { Profile } from "./profiles.entity.ts";
import { Tag } from "./tags.entity.ts";
import { TaxFiling } from "./tax-filings.entity.ts";
import { UserPreferences } from "./user-preferences.entity.ts";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field((type) => ID!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => String!)
  @Column("text", { unique: true })
  email!: string;

  @Column("text")
  password!: string;

  @Field((type) => String!)
  @Column("text")
  firstName!: string;

  @Field((type) => String)
  @Column("text")
  lastName!: string;

  @Field((type) => String!)
  @CreateDateColumn()
  createdAt!: Date;

  @Field((type) => String!)
  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile!: Profile;

  @OneToOne(() => UserPreferences, (preferences) => preferences.user)
  preferences!: UserPreferences;

  @ManyToOne(() => Currency, (currency) => currency.users)
  @JoinColumn({ name: "currency_id" })
  currency!: Currency;

  @OneToMany(() => Account, (account) => account.user)
  accounts!: Account[];

  @OneToMany(() => Category, (category) => category.user)
  categories!: Category[];

  @OneToMany(() => Merchants, (merchant) => merchant.user)
  merchants!: Merchants[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags!: Tag[];

  @OneToMany(() => Budget, (budget) => budget.user)
  budgets!: Budget[];

  @OneToMany(() => Goal, (goal) => goal.user)
  goals!: Goal[];

  @OneToMany(() => Bill, (bill) => bill.user)
  bills!: Bill[];

  @OneToMany(() => Debt, (debt) => debt.user)
  debts!: Debt[];

  @OneToMany(() => TaxFiling, (taxFiling) => taxFiling.user)
  taxFilings!: TaxFiling[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications!: Notification[];

  @OneToMany(() => AuditLogs, (auditLog) => auditLog.user)
  auditLogs!: AuditLogs[];
}
