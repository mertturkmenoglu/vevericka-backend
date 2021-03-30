import * as yup from 'yup';

const followUserSchema = yup.object().shape({
  thisUsername: yup.string().required().max(32).lowercase(),
  otherUsername: yup.string().required().max(32).lowercase(),
});

const isValidFollowUserDto = (dto: object) => followUserSchema.isValid(dto);

export default isValidFollowUserDto;
