import * as yup from 'yup';

const sendPasswordResetEmailSchema = yup.object().shape({
  email: yup.string().required().email().max(255),
});

const isValidSendPasswordResetEmailDto = (dto: object) => sendPasswordResetEmailSchema.isValid(dto);

export default isValidSendPasswordResetEmailDto;
