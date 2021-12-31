import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LanguageKey } from "./data/language-key.enum";
import { User } from "./user.entity";

@Entity()
export class WishToSpeakLanguage {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ type: 'enum', nullable: false, enum: LanguageKey })
  key!: LanguageKey;

  @ManyToOne(() => User, (user) => user.speaking)
  user!: User;
}
