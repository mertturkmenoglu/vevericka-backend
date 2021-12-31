import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Hobby {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ type: 'varchar', nullable: false })
  hobby!: string;

  @ManyToOne(() => User, (user) => user.hobbies)
  user!: User;
}
