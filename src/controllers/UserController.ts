import {
  Authorized,
  BadRequestError,
  Body,
  Get,
  JsonController,
  NotFoundError,
  Param,
  Post,
  Put,
  QueryParam,
  UseBefore,
  UseInterceptor,
} from 'routing-controllers';
import { Service } from 'typedi';
import UserService from '../services/UserService';
import FollowUserDto from '../dto/FollowUserDto';
import IsAuth from '../middlewares/IsAuth';
import { Role } from '../role';
import UnfollowUserDto from '../dto/UnfollowUserDto';
import UpdateUserDto from '../dto/UpdateUserDto';
import { DocumentToJsonInterceptor } from '../interceptors/DocumentToJsonInterceptor';

@JsonController('/api/v2/user')
@UseInterceptor(DocumentToJsonInterceptor)
@Service()
class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/q')
  async searchUsersByQuery(@QueryParam('searchTerm') searchTerm: string) {
    const result = await this.userService.searchUsers(searchTerm);

    if (!result) {
      throw new BadRequestError('Malformed query');
    }

    return result;
  }

  @Get('/username/:username')
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.userService.getUserByUsername(username);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  @Post('/follow')
  @UseBefore(IsAuth)
  @Authorized(Role.FOLLOW_USER)
  async followUser(@Body() dto: FollowUserDto) {
    const thisUser = await this.userService.getUserByUsername(dto.thisUsername);
    const otherUser = await this.userService.getUserByUsername(dto.otherUsername);

    if (!thisUser || !otherUser) {
      throw new NotFoundError('User(s) not found');
    }

    // thisUser already follows otherUser
    if (thisUser.following.includes(otherUser.id)) {
      throw new BadRequestError('Already following');
    }

    thisUser.following.push(otherUser.id);
    otherUser.followers.push(thisUser.id);

    await thisUser.save();
    await otherUser.save();
  }

  @Post('/unfollow')
  @UseBefore(IsAuth)
  @Authorized(Role.UNFOLLOW_USER)
  async unfollowUser(@Body() dto: UnfollowUserDto) {
    const thisUser = await this.userService.getUserByUsernameNotPopulated(dto.thisUsername);
    const otherUser = await this.userService.getUserByUsernameNotPopulated(dto.otherUsername);

    if (!thisUser || !otherUser) {
      throw new NotFoundError('User(s) not found');
    }

    /**
     * Interestingly, I couldn't achieve type checking.
     * User.id should be a string but when I use triple-equal check,
     * it doesn't work. Also, type-casting didn't work.
     */

    // eslint-disable-next-line eqeqeq
    thisUser.following = thisUser.following.filter((id) => id != otherUser.id);
    // eslint-disable-next-line eqeqeq
    otherUser.followers = otherUser.followers.filter((id) => id != thisUser.id);

    await thisUser.save();
    await otherUser.save();

    return {
      message: 'Unfollowed',
    };
  }

  // noinspection DuplicatedCode
  @Put('/')
  @UseBefore(IsAuth)
  @Authorized(Role.UPDATE_USER)
  async updateUser(@Body() dto: UpdateUserDto) {
    const user = await this.userService.getUserByUsername(dto.username);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.name = dto.name || user.name;
    user.image = dto.image || user.image;
    user.hobbies = dto.hobbies || user.hobbies;
    user.features = dto.features || user.features;
    user.bdate = dto.bdate || user.bdate;
    user.location = dto.location || user.location;
    user.job = dto.job || user.job;
    user.school = dto.school || user.school;
    user.website = dto.website || user.website;
    user.twitter = dto.twitter || user.twitter;
    user.bio = dto.bio || user.bio;
    user.gender = dto.gender || user.gender;
    user.wishToSpeak = dto.wishToSpeak || user.wishToSpeak;

    if (dto.languages) {
      user.languages = dto.languages.map((it) => ({
        language: it.language.toString(),
        proficiency: it.proficiency.toString(),
      }));
    }

    return user.save();
  }
}

export default UserController;
