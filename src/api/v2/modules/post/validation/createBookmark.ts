import * as yup from 'yup';

const createBookmarkSchema = yup.object().shape({
  postId: yup.string().required(),
  belongsTo: yup.string().required().max(32),
});

const isValidCreateBookmarkDto = (dto: object) => createBookmarkSchema.isValid(dto);

export default isValidCreateBookmarkDto;
