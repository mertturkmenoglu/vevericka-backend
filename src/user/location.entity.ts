import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ nullable: false })
  city!: string;

  @Column({ nullable: false })
  country!: string;
}
