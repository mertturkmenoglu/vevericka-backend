import { Service } from 'typedi';
import { PostDocument } from '../models/Post';
import PostRepository from '../repositories/PostRepository';
import { UserDocument } from '../models/User';
import CommentRepository from '../repositories/CommentRepository';
import BookmarkRepository from '../repositories/BookmarkRepository';
import CreatePostDto from '../dto/CreatePostDto';
import UserRepository from '../repositories/UserRepository';
import NotificationRepository from '../repositories/NotificationRepository';
import { NotificationType } from '../models/Notification';

@Service()
class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
    private readonly bookmarkRepository: BookmarkRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async getPostById(id: string): Promise<PostDocument | null> {
    return this.postRepository.findPostById(id);
  }

  async getUserPosts(userId: string): Promise<PostDocument[] | null> {
    return this.postRepository.findPostsByUsername(userId);
  }

  async getUserFeed(user: UserDocument): Promise<PostDocument[] | null> {
    const users = [...user.following, user.id];
    return this.postRepository.getUserFeed(users);
  }

  async deletePost(postId: string) {
    await this.postRepository.deletePost(postId);
    await this.commentRepository.deleteCommentsByPostId(postId);
    await this.bookmarkRepository.deleteBookmarksByPostId(postId);
  }

  async createPost(dto: CreatePostDto) {
    const USERNAME_REGEX = /@[-A-Z0-9_]+/gi;
    const HASHTAG_REGEX = /#[-A-Z0-9_]+/gi;

    const doc = {
      createdBy: dto.createdBy,
      content: dto.content,
      comments: [],
      hashtags: Array<string>(),
      mentions: Array<string>(),
    };

    const tagsMatch = dto.content.match(HASHTAG_REGEX);
    const mentionsMatch = dto.content.match(USERNAME_REGEX);

    if (tagsMatch) {
      doc.hashtags = tagsMatch.map((tag) => tag.substring(1));
    }

    if (mentionsMatch) {
      doc.mentions = mentionsMatch.map((mention) => mention.substr(1));
    }

    const saved = await this.postRepository.savePost(doc);
    const usersQuery = await Promise.all(
      doc.mentions.map((username) => this.userRepository.findUserByUsernameSafe(username)),
    );
    usersQuery
      .filter((it) => it !== null)
      .forEach((user) => {
        this.notificationRepository.createNotification({
          origin: doc.createdBy,
          target: user?.id,
          type: NotificationType.ON_MENTION,
          metadata: saved?.id,
        });
      });

    return saved;
  }
}

export default PostService;
