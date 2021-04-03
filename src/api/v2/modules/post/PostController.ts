import { Request, Response } from 'express';
import PostService from './PostService';
import err from '../../../../utils/err';
import HttpCodes from '../../../../utils/HttpCodes';
import response from '../../../../utils/response';
import BaseController from '../../interfaces/BaseController';
import { User } from '../../../../models/User';
import CreatePostDto from './dto/CreatePostDto';
import { Post } from '../../../../models/Post';
import { Comment } from '../../../../models/Comment';
import CreateCommentDto from './dto/CreateCommentDto';
import { Bookmark } from '../../../../models/Bookmark';
import CreateBookmarkDto from './dto/CreateBookmarkDto';

class PostController extends BaseController {
  constructor(readonly postService: PostService) {
    super();
    this.postService = postService;
  }

  async getPostById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(HttpCodes.BAD_REQUEST).json(err('Invalid post id', HttpCodes.BAD_REQUEST));
    }

    const post = await this.postService.getPostById(id);

    if (!post) {
      return res.status(HttpCodes.NOT_FOUND).json(err('Post not found', HttpCodes.NOT_FOUND));
    }

    return res.json(response(post));
  }

  async getUserPosts(req: Request, res: Response) {
    const { username } = req.params;

    if (!username) {
      return res.status(HttpCodes.BAD_REQUEST).json(err('Invalid username', HttpCodes.BAD_REQUEST));
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(HttpCodes.NOT_FOUND).json(err('User not found', HttpCodes.NOT_FOUND));
    }

    const posts = await this.postService.getUserPosts(username);
    return res.json(response(posts));
  }

  async getUserFeed(req: Request, res: Response) {
    const { username } = req.params;

    if (!username) {
      return res.status(HttpCodes.BAD_REQUEST).json(err('Invalid username', HttpCodes.BAD_REQUEST));
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(HttpCodes.NOT_FOUND).json(err('User not found', HttpCodes.NOT_FOUND));
    }

    const feed = await this.postService.getUserFeed(user);
    return res.json(response(feed));
  }

  // eslint-disable-next-line class-methods-use-this
  async createPost(req: Request, res: Response) {
    const dto = req.body as CreatePostDto;

    const post = new Post({
      createdBy: dto.createdBy,
      content: dto.content,
      comments: [],
    });

    try {
      const savedPost = await post.save();
      return res.status(HttpCodes.CREATED).json(response(savedPost));
    } catch (e) {
      return res.status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json(err('Server error: Cannot create post', HttpCodes.INTERNAL_SERVER_ERROR));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async deletePost(req: Request, res: Response) {
    const postId = req.params.id;

    try {
      await Post.findByIdAndDelete(postId);
      return res.status(HttpCodes.NO_CONTENT).end();
    } catch (e) {
      return res.status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json(err('Server error: Cannot delete post', HttpCodes.INTERNAL_SERVER_ERROR));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteComment(req: Request, res: Response) {
    const commentId = req.params.id;

    try {
      await Comment.findByIdAndDelete(commentId);
      return res.status(HttpCodes.NO_CONTENT).end();
    } catch (e) {
      return res.status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json(err('Server error: Cannot delete post', HttpCodes.INTERNAL_SERVER_ERROR));
    }
  }

  async getCommentById(req: Request, res: Response) {
    const commentId = req.params.id;

    if (!commentId) {
      return res.status(HttpCodes.BAD_REQUEST).json(err('Invalid comment id', HttpCodes.BAD_REQUEST));
    }

    const comment = await this.postService.getCommentById(commentId);

    if (!comment) {
      return res.status(HttpCodes.NOT_FOUND).json(err('Comment not found', HttpCodes.NOT_FOUND));
    }

    return res.json(response(comment));
  }

  async createComment(req: Request, res: Response) {
    const dto = req.body as CreateCommentDto;
    const post = await this.postService.getPostById(dto.postId);

    if (!post) {
      return res.status(HttpCodes.NOT_FOUND)
        .json(err('Post not found', HttpCodes.NOT_FOUND));
    }

    const comment = new Comment({
      postId: post.id,
      createdBy: dto.createdBy,
      content: dto.content,
    });

    try {
      const savedComment = await comment.save();
      post.comments = [...post.comments, savedComment.id];
      await post.save();
      return res.status(HttpCodes.CREATED)
        .json(response(savedComment));
    } catch (e) {
      return res.status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json(err('Server error: Cannot create comment', HttpCodes.INTERNAL_SERVER_ERROR));
    }
  }

  async getBookmarkById(req: Request, res: Response) {
    const bookmarkId = req.params.id;

    if (!bookmarkId) {
      return res.status(HttpCodes.BAD_REQUEST)
        .json(err('Invalid bookmark id', HttpCodes.BAD_REQUEST));
    }

    const bookmark = await this.postService.getBookmarkById(bookmarkId);

    if (!bookmark) {
      return res.status(HttpCodes.NOT_FOUND)
        .json(err('Bookmark not found', HttpCodes.NOT_FOUND));
    }

    return res.json(response(bookmark));
  }

  async getUserBookmarks(req: Request, res: Response) {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(HttpCodes.NOT_FOUND)
        .json(err('User not found', HttpCodes.NOT_FOUND));
    }

    const bookmarks = await this.postService.getUserBookmarks(user.id);

    if (!bookmarks) {
      return res.status(HttpCodes.NOT_FOUND)
        .json(err('Bookmarks not found', HttpCodes.NOT_FOUND));
    }

    return res.json(response(bookmarks));
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteBookmark(req: Request, res: Response) {
    const bookmarkId = req.params.id;

    if (!bookmarkId) {
      return res.status(HttpCodes.BAD_REQUEST)
        .json(err('Invalid bookmark id', HttpCodes.BAD_REQUEST));
    }

    try {
      await Bookmark.findByIdAndDelete(bookmarkId);
      return res.status(HttpCodes.NO_CONTENT).end();
    } catch (e) {
      return res.status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json(err('Server error: Cannot delete bookmark', HttpCodes.INTERNAL_SERVER_ERROR));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async createBookmark(req: Request, res: Response) {
    const dto = req.body as CreateBookmarkDto;
    const post = await this.postService.getPostById(dto.postId);

    if (!post) {
      return res.status(HttpCodes.NOT_FOUND)
        .json(err('Post not found', HttpCodes.NOT_FOUND));
    }

    const bookmark = new Bookmark({
      postId: post.id,
      belongsTo: dto.belongsTo,
    });

    try {
      const savedBookmark = await bookmark.save();
      return res.status(HttpCodes.CREATED)
        .json(response(savedBookmark));
    } catch (e) {
      return res.status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json(err('Server error: Cannot create bookmark', HttpCodes.INTERNAL_SERVER_ERROR));
    }
  }
}

export default PostController;
