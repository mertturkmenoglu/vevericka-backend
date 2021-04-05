import isValidFollowUserDto from './modules/auth/validation/followUser';
import isValidLoginDto from './modules/auth/validation/login';
import isValidRegisterDto from './modules/auth/validation/register';
import isValidResetPasswordDto from './modules/auth/validation/resetPassword';
import isValidSendPasswordResetEmailDto from './modules/auth/validation/sendPasswordResetEmail';
import isValidCreateChatDto from './modules/message/validation/createChat';
import isValidGetChatDto from './modules/message/validation/getChat';
import isValidCreateBookmarkDto from './modules/post/validation/createBookmark';
import isValidCreateCommentDto from './modules/post/validation/createComment';
import isValidCreatePostDto from './modules/post/validation/createPost';
import isValidUnfollowUserDto from './modules/user/validation/unfollowUser';
import isValidUpdateUserDto from './modules/user/validation/updateUser';
import { DtoType, DtoValidationFn } from './types';

const validation: Record<DtoType, DtoValidationFn> = {
  register: isValidRegisterDto,
  login: isValidLoginDto,
  'send-password-reset-email': isValidSendPasswordResetEmailDto,
  'reset-password': isValidResetPasswordDto,
  'follow-user': isValidFollowUserDto,
  'unfollow-user': isValidUnfollowUserDto,
  'update-user': isValidUpdateUserDto,
  'create-post': isValidCreatePostDto,
  'create-comment': isValidCreateCommentDto,
  'create-bookmark': isValidCreateBookmarkDto,
  'create-chat': isValidCreateChatDto,
  'get-chat': isValidGetChatDto,
};

export default validation;
