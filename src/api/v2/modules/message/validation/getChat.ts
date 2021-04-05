import * as yup from 'yup';

const getChatSchema = yup.object().shape({
  userId: yup.string().required(),
  username: yup.string().required(),
});

const isvValidGetChatDto = (dto: object) => getChatSchema.isValid(dto);

export default isvValidGetChatDto;
