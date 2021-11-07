import AuthController from "./controllers/AuthController";
import BookmarkController from "./controllers/BookmarkController";
import CommentController from "./controllers/CommentController";
import ExploreController from "./controllers/ExploreController";
import MessageController from "./controllers/MessageController";
import NotificationController from "./controllers/NotificationController";
import PostController from "./controllers/PostController";
import UserController from "./controllers/UserController";

const controllers: Function[] = [
  AuthController,
  UserController,
  PostController,
  BookmarkController,
  CommentController,
  MessageController,
  ExploreController,
  NotificationController,
];

export default {
  controllers,
};