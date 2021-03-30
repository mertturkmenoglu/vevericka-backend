import { Request, Response } from 'express';
import UserService from '../../services/v2/UserService';
import err from '../../utils/err';
import HttpCodes from '../../utils/HttpCodes';
import response from '../../utils/response';
import BaseController from './BaseController';

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
}

export default UserController;
