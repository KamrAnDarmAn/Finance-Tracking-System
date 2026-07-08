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

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field((_type) => ID!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((_type) => String!)
  @Column("text", { unique: true })
  email!: string;

  @Column("text")
  password!: string;

  @Field((_type) => String!)
  @Column("text", { default: "" })
  firstName!: string;

  @Field((_type) => String, { nullable: true })
  @Column("text")
  lastName!: string;

  @Field((_type) => String!)
  @CreateDateColumn()
  createdAt!: Date;

  @Field((_type) => String!)
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

  @Field(() => UserPreferences)
  _preferences!: UserPreferences;

  // TODO implement forget password

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
