import * as yup from 'yup';

const createChatSchema = yup.object().shape({
  users: yup.array().of(yup.string()).required(),
  isGroupChat: yup.boolean().required(),
  createdBy: yup.string().required(),
});

const isValidCreateChatDto = (dto: object) => createChatSchema.isValid(dto);

export default isValidCreateChatDto;
