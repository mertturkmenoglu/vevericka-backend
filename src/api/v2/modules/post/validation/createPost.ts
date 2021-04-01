import * as yup from 'yup';

const createPostSchema = yup.object().shape({
  createdBy: yup.string().required().max(32),
  content: yup.string().required().max(255),
});

const isValidCreatePostDto = (dto: object) => createPostSchema.isValid(dto);

export default isValidCreatePostDto;
