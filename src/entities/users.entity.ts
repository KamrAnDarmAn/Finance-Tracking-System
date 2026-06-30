import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ForeignKey,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import {
  Account,
  AuditLogs,
  Bill,
  Budget,
  Category,
  Currency,
  Debt,
  Goal,
  Merchants,
  Notification,
  Profile,
  Tag,
  TaxFiling,
  UserPreferences,
} from "@/entities/index.ts";
import z from "zod";

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
  @Column("text", { default: "" })
  firstName!: string;

  @Field((type) => String, { nullable: true })
  @Column("text")
  lastName!: string;

  @Field((type) => String!)
  @CreateDateColumn()
  createdAt!: Date;

  @Field((type) => String!)
  @UpdateDateColumn()
  updatedAt!: Date;

  // @ForeignKey(() => String)
  // profileId!: string;

  @Field(() => Profile, { nullable: true })
  _profile!: Profile;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile!: Profile;

  @OneToOne(() => UserPreferences, (preferences) => preferences.user, {
    cascade: true,
  })
  preferences!: UserPreferences;

  @ManyToOne(() => Currency, (currency) => currency.users, { cascade: true })
  @JoinColumn({ name: "currency_id" })
  currency!: Currency;

  @OneToMany(() => Account, (account) => account.user, { cascade: true })
  accounts!: Account[];

  @OneToMany(() => Category, (category) => category.user, { cascade: true })
  categories!: Category[];

  @OneToMany(() => Merchants, (merchant) => merchant.user, { cascade: true })
  merchants!: Merchants[];

  @OneToMany(() => Tag, (tag) => tag.user, { cascade: true })
  tags!: Tag[];

  @OneToMany(() => Budget, (budget) => budget.user, { cascade: true })
  budgets!: Budget[];

  @OneToMany(() => Goal, (goal) => goal.user, { cascade: true })
  goals!: Goal[];

  @OneToMany(() => Bill, (bill) => bill.user, { cascade: true })
  bills!: Bill[];

  @OneToMany(() => Debt, (debt) => debt.user, { cascade: true })
  debts!: Debt[];

  @OneToMany(() => TaxFiling, (taxFiling) => taxFiling.user, { cascade: true })
  taxFilings!: TaxFiling[];

  @OneToMany(() => Notification, (notification) => notification.user, {
    cascade: true,
  })
  notifications!: Notification[];

  @OneToMany(() => AuditLogs, (auditLog) => auditLog.user, { cascade: true })
  auditLogs!: AuditLogs[];
}
