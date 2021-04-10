import * as yup from 'yup';

const getChatMessagesSchema = yup.object().shape({
  username: yup.string().required(),
});

const isValidGetChatMessagesDto = (dto: object) => getChatMessagesSchema.isValid(dto);

export default isValidGetChatMessagesDto;
