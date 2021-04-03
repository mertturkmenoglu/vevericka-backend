import * as yup from 'yup';

const updateUserSchema = yup.object().shape({
  username: yup.string().required().max(32),
  name: yup.string().max(255).trim().notRequired(),
  image: yup.string().trim().notRequired(),
  hobbies: yup.array().of(yup.string()).notRequired(),
  features: yup.array().of(yup.string()).max(5).notRequired(),
  bdate: yup.date().notRequired(),
  location: yup.object().notRequired(),
  job: yup.string().max(255).trim().notRequired(),
  school: yup.string().max(255).trim().notRequired(),
  website: yup.string().url().notRequired(),
  twitter: yup.string().max(32).notRequired(),
  bio: yup.string().max(255).trim().notRequired(),
  gender: yup.string().max(32).notRequired(),
  languages: yup.array().notRequired(),
  wishToSpeak: yup.array().of(yup.string().trim()).notRequired(),
});

const isValidUpdateUserDto = (dto: object) => updateUserSchema.isValid(dto);

export default isValidUpdateUserDto;
