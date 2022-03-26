import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateHobbyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  hobby!: string;
}
