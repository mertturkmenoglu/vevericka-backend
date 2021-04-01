import * as yup from 'yup';

const unfollowUserSchema = yup.object().shape({
  thisUsername: yup.string().required().max(32).lowercase(),
  otherUsername: yup.string().required().max(32).lowercase(),
});

const isValidUnfollowUserDto = (dto: object) => unfollowUserSchema.isValid(dto);

export default isValidUnfollowUserDto;
