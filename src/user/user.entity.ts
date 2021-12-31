import { IStringConstraint } from "src/types/IStringConstraint";
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Hobby } from "./hobby.entity";
import { SpeakingLanguage } from "./speaking-language.entity";
import { WishToSpeakLanguage } from "./wish-to-speak-language.entity";

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

export enum GenderOptions {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
};

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: UserConstraints.username.max, nullable: false })
  @Index({ spatial: true })
  username!: string;

  @Column({ unique: true, length: UserConstraints.email.max, nullable: false })
  @Index()
  email!: string;

  @Column({ length: UserConstraints.name.max, nullable: false })
  name!: string;

  @Column({ nullable: false, default: 'profile.png' })
  image!: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  job!: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  twitterHandle!: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  school!: string | null;

  @Column({ type: 'date', nullable: true, default: null })
  birthDate!: Date | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  website!: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  description!: string | null;

  @Column({ default: false })
  verified!: boolean;

  @Column({ default: false })
  protected!: boolean;

  @Column({ type: "varchar", nullable: false, default: 'banner.png' })
  bannerImage!: string;

  @Column({ type: 'enum', enum: GenderOptions, nullable: true, default: null })
  gender!: GenderOptions;

  @Column({ type: 'varchar', nullable: true, default: null })
  genderOther!: string | null;

  @OneToMany(() => SpeakingLanguage, (language) => language.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  speaking!: SpeakingLanguage[];

  @OneToMany(() => WishToSpeakLanguage, (language) => language.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  wishToSpeak!: WishToSpeakLanguage[];

  @OneToMany(() => Hobby, (hobby) => hobby.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  hobbies!: Hobby[];

  @OneToMany(() => Hobby, (hobby) => hobby.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  features!: Hobby[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
