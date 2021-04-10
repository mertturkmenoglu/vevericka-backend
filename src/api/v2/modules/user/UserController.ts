import { Request, Response } from 'express';
import { Service } from 'typedi';
import UserService from './UserService';
import HttpCodes from '../../../../utils/HttpCodes';
import response from '../../../../utils/response';
import FollowUserDto from './dto/FollowUserDto';
import UnfollowUserDto from './dto/UnfollowUserDto';
import UpdateUserDto from './dto/UpdateUserDto';
import NotFound from '../../../../errors/NotFound';
import BadRequest from '../../../../errors/BadRequest';

@Service()
class UserController {
  constructor(private readonly userService: UserService) { }

  async getUserByUsername(req: Request, res: Response) {
    const { username } = req.params;
    const user = await this.userService.getUserByUsername(username);

    if (!user) {
      throw new NotFound('User not found');
    }

    return res.json(response(user));
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new NotFound('User not found');
    }

    return res.json(response(user));
  }

  async followUser(req: Request, res: Response) {
    const dto = req.body as FollowUserDto;
    const thisUser = await this.userService.getUserByUsername(dto.thisUsername);
    const otherUser = await this.userService.getUserByUsername(dto.otherUsername);

    if (!thisUser || !otherUser) {
      throw new NotFound('User(s) not found');
    }

    // thisUser already follows otherUser
    if (thisUser.following.includes(otherUser.id)) {
      throw new BadRequest('Already following');
    }

    thisUser.following.push(otherUser.id);
    otherUser.followers.push(thisUser.id);

    await thisUser.save();
    await otherUser.save();
    return res.status(HttpCodes.NO_CONTENT).end();
  }

  async unfollowUser(req: Request, res: Response) {
    const dto = req.body as UnfollowUserDto;
    const thisUser = await this.userService.getUserByUsername(dto.thisUsername);
    const otherUser = await this.userService.getUserByUsername(dto.otherUsername);

    if (!thisUser || !otherUser) {
      throw new NotFound('User(s) not found');
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
    return res.status(HttpCodes.NO_CONTENT).end();
  }

  async updateUser(req: Request, res: Response) {
    const dto = req.body as UpdateUserDto;
    const user = await this.userService.getUserByUsername(dto.username);

    if (!user) {
      throw new NotFound('user not found');
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
    user.languages = dto.languages || user.languages;
    user.wishToSpeak = dto.wishToSpeak || user.wishToSpeak;

    const updatedUser = await user.save();
    return res.json(response(updatedUser));
  }

  async searchUsersByQuery(req: Request, res: Response) {
    const { searchTerm } = req.query;

    if (typeof searchTerm !== 'string') {
      throw new BadRequest('Invalid query parameter');
    }

    const result = await this.userService.searchUsers(searchTerm);

    if (!result) {
      throw new BadRequest('Malformed query');
    }

    return res.json(response(result));
  }
}

export default UserController;
