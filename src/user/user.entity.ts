import { IStringConstraint } from "src/types/IStringConstraint";
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
// import { Location } from "./location.model";

type UserField =
  | 'username'
  | 'email'
  | 'password'
  | 'name';

export const UserConstraints: Record<UserField, IStringConstraint> = {
  username: {
    min: 1,
    max: 32,
  },
  email: {
    min: 1,
    max: 255,
  },
  password: {
    min: 1,
    max: 1024,
  },
  name: {
    min: 1,
    max: 64,
  },
} as const;

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: UserConstraints.username.max, nullable: false })
  @Index({ spatial: true })
  username!: string;

  @Column({ unique: true, length: UserConstraints.email.max, nullable: false })
  @Index({ spatial: true })
  email!: string;

  @Column({ nullable: false, select: false })
  password!: string;

  @Column({ length: UserConstraints.name.max, nullable: false })
  name!: string;

  @Column({ nullable: false, default: 'profile.png' })
  image!: string;

  // @Column({ array: true, default: [] })
  // hobbies!: string[];

  // @Column({ array: true, default: [] })
  // features!: string[];

  @Column({ nullable: true })
  bdate?: Date;

  // // followers: string[];
  // // following: string[];
  // @Column({ nullable: true })
  // location?: Location;

  @Column({ nullable: true, length: 128 })
  job?: string;

  @Column({ nullable: true, length: 64 })
  school?: string;

  @Column({ nullable: true, length: 64 })
  website?: string;

  @Column({ nullable: true, length: 64 })
  twitter?: string;

  @Column({ nullable: true, length: 256 })
  bio?: string;

  @Column({ nullable: true, length: 32 })
  gender?: string;

  @Column()
  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt!: Date;

  // languages: Language[];
  // wishToSpeak: string[];
}
