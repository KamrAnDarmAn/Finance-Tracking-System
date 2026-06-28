import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./users.entity.ts";

@ObjectType()
@Entity("audit_logs")
export class AuditLogs extends BaseEntity {
  @Field((type) => String!)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field((type) => String)
  @Column("text")
  action!: string;

  @Field((type) => String)
  @Column("text")
  tableName!: string;

  @Field((type) => String)
  @Column("text")
  recordId!: string;

  @Column("timestamp")
  actionTimestamp!: Date;

  @ManyToOne(() => User, (user) => user.auditLogs)
  @JoinColumn({ name: "user_id" })
  user!: User;
}
