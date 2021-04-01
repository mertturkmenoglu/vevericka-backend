import * as yup from 'yup';

const resetPasswordSchema = yup.object().shape({
  email: yup.string().required().email().max(255),
  password: yup.string().required().min(8),
  code: yup.string().required(),
});

const isValidResetPasswordDto = (dto: object) => resetPasswordSchema.isValid(dto);

export default isValidResetPasswordDto;
