import { Request, Response } from 'express';
import UserService from '../../services/v2/UserService';
import err from '../../utils/err';
import HttpCodes from '../../utils/HttpCodes';
import response from '../../utils/response';
import BaseController from './BaseController';
import FollowUserDto from './dto/FollowUserDto';
import UnfollowUserDto from './dto/UnfollowUserDto';
import UpdateUserDto from './dto/UpdateUserDto';

class UserController extends BaseController {
  constructor(readonly userService: UserService) {
    super();
    this.userService = userService;
  }

  async getUserByUsername(req: Request, res: Response) {
    const { username } = req.params;
    const user = await this.userService.getUserByUsername(username);

    if (!user) {
      return res.status(HttpCodes.NOT_FOUND).json(err('User not found', HttpCodes.NOT_FOUND));
    }

    return res.json(response(user));
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const user = await this.userService.getUserById(id);

    if (!user) {
      return res.status(HttpCodes.NOT_FOUND).json(err('User not found', HttpCodes.NOT_FOUND));
    }

    return res.json(response(user));
  }

  async followUser(req: Request, res: Response) {
    const dto = req.body as FollowUserDto;
    const thisUser = await this.userService.getUserByUsername(dto.thisUsername);
    const otherUser = await this.userService.getUserByUsername(dto.otherUsername);

    if (!thisUser || !otherUser) {
      return res.status(HttpCodes.NOT_FOUND).json(err('User(s) not found', HttpCodes.NOT_FOUND));
    }

    // thisUser already follows otherUser
    if (thisUser.following.includes(otherUser.id)) {
      return res.status(HttpCodes.BAD_REQUEST).json(err('Already following', HttpCodes.BAD_REQUEST));
    }

    thisUser.following.push(otherUser.id);
    otherUser.followers.push(thisUser.id);

    try {
      await thisUser.save();
      await otherUser.save();
      return res.status(HttpCodes.NO_CONTENT).end();
    } catch (e) {
      return res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json(err('Server error: Cannot follow', HttpCodes.INTERNAL_SERVER_ERROR));
    }
  }

  async unfollowUser(req: Request, res: Response) {
    const dto = req.body as UnfollowUserDto;
    const thisUser = await this.userService.getUserByUsername(dto.thisUsername);
    const otherUser = await this.userService.getUserByUsername(dto.otherUsername);

    if (!thisUser || !otherUser) {
      return res.status(HttpCodes.NOT_FOUND).json(err('User(s) not found', HttpCodes.NOT_FOUND));
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

    try {
      await thisUser.save();
      await otherUser.save();
      return res.status(HttpCodes.NO_CONTENT).end();
    } catch (e) {
      return res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json(err('Server error: Cannot follow', HttpCodes.INTERNAL_SERVER_ERROR));
    }
  }

  async updateUser(req: Request, res: Response) {
    const dto = req.body as UpdateUserDto;
    const user = await this.userService.getUserByUsername(dto.username);

    if (!user) {
      return res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json(err('Server error: User not found', HttpCodes.INTERNAL_SERVER_ERROR));
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

    try {
      const updatedUser = await user.save();
      return res
        .status(HttpCodes.OK)
        .json(response(updatedUser));
    } catch (e) {
      return res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json(err('Server error: Cannot update user', HttpCodes.INTERNAL_SERVER_ERROR));
    }
  }

  async searchUsersByQuery(req: Request, res: Response) {
    try {
      const { searchTerm } = req.query;

      if (typeof searchTerm !== 'string') {
        return res
          .status(HttpCodes.BAD_REQUEST)
          .json(err('Invalid query parameter', HttpCodes.BAD_REQUEST));
      }

      const result = this.userService.searchUsers(searchTerm);

      if (!result) {
        return res
          .status(HttpCodes.BAD_REQUEST)
          .json(err('Malformed query', HttpCodes.BAD_REQUEST));
      }

      return res.json(response(result));
    } catch (e) {
      return res
        .status(HttpCodes.BAD_REQUEST)
        .json(err('Invalid query parameter', HttpCodes.BAD_REQUEST));
    }
  }
}

export default UserController;
