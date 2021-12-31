import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LanguageKey } from "./data/language-key.enum";
import { LanguageProficiency } from "./data/language-proficiency.enum";
import { User } from "./user.entity";

@Entity()
export class SpeakingLanguage {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ type: 'enum', nullable: false, enum: LanguageKey })
  key!: LanguageKey;

  @Column({ type: 'enum', nullable: false, default: LanguageProficiency.ELEMENTARY, enum: LanguageProficiency })
  proficiency!: LanguageProficiency;

  @ManyToOne(() => User, (user) => user.speaking)
  user!: User;
}
