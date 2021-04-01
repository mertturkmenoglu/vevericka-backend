import * as yup from 'yup';

const createCommentSchema = yup.object().shape({
  postId: yup.string().required(),
  createdBy: yup.string().required().max(32),
  content: yup.string().required().max(255),
});

const isValidCreateCommentDto = (dto: object) => createCommentSchema.isValid(dto);

export default isValidCreateCommentDto;
