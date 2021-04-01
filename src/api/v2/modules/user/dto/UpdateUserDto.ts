type Location = {
  city: string;
  country: string;
}

type Language = {
  language: string;
  proficiency: string;
}

interface UpdateUserDto {
  username: string;
  name?: string;
  image?: string;
  hobbies?: string[];
  features?: string[];
  bdate?: Date;
  location?: Location;
  job?: string;
  school?: string;
  website?: string;
  twitter?: string;
  bio?: string;
  gender?: string;
  languages?: Language[];
  wishToSpeak: string[];
}

export default UpdateUserDto;
