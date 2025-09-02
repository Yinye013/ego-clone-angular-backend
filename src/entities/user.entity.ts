import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }

    if (!this.createdAt) {
      this.createdAt = new Date();
    }

    if (!this.updatedAt) {
      this.updatedAt = new Date();
    }
  }

  @Column({ nullable: true })
  profileImage: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  requireOTP: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  mobilePhone: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  branch: string;

  @Column({ default: false })
  superUser: boolean;

  @Column({ nullable: true })
  systemRole: string;

  @Column({ type: "text", nullable: true })
  address: string;
}
