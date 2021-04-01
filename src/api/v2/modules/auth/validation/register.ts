import * as yup from 'yup';

const registerSchema = yup.object().shape({
  username: yup.string().required().max(32).lowercase(),
  email: yup.string().required().email().max(255),
  password: yup.string().required().min(8),
  name: yup.string().required().max(255).trim(),
});

const isValidRegisterDto = (dto: object) => registerSchema.isValid(dto);

export default isValidRegisterDto;
