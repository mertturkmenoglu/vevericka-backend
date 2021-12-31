import { IStringConstraint } from "src/types/IStringConstraint";
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

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
  @Index()
  email!: string;

  @Column({ length: UserConstraints.name.max, nullable: false })
  name!: string;

  @Column({ nullable: false, default: 'profile.png' })
  image!: string;
}
