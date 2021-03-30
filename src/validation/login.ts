import * as yup from 'yup';

const loginSchema = yup.object().shape({
  email: yup.string().required().email().max(255),
  password: yup.string().required().min(8),
});

const isValidLoginDto = (dto: object) => loginSchema.isValid(dto);

export default isValidLoginDto;
