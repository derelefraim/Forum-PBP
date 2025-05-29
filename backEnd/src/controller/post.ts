import { Post } from "../../models/post"; 
import { Request, Response } from "express";
import { User } from "../../models/user";
import { Like } from "../../models/like";
import { fn, col } from 'sequelize';
import { controllerWrapper } from '../utils/controllerWrapper';

// import dayjs from 'dayjs';



// -- create post  image and category bagian createpost, bagian reivel
export const createPost = async (req: any, res: any) => {
    const { title, content, category, user_id } = req.body;
    const image_url = req.file ? req.file.filename : null;

    try {
        const post = await Post.create({
            title,
            content,
            user_id,
            category,
            image_url,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        res.status(201).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error });
    }
}




// -- Get all posts + its post`s username + bikin virtual column totalLikes
export const getAllPosts = controllerWrapper(async (req: Request, res: Response) => {
  const posts = await Post.findAll({
    include: [
      {
        model: User,
        attributes: ['username']
      },
      {
        model: Like,
        attributes: []
      }
    ],

    attributes: {
      include: [
        [fn('COUNT', col('likes.like_id')), 'totalLikes']
      ]
    },

    group: ['Post.post_id', 'user.user_id'] 
  });
  return posts;
});


//get all variable from a post by postId
export const getAllVariable = controllerWrapper(async (req: Request, res: Response) => {
  const post_id = req.params.post_id;  // dari route :post_id
  const post = await Post.findOne({
    where: { post_id: post_id },
    attributes: ['post_id', 'title', 'content', 'user_id','image_url', 'category', 'createdAt', 'updatedAt' , [fn('COUNT', col('likes.like_id')), 'totalLikes']],
    include: [
      {
        model: User,
        attributes: ['username'],
      },
      {
        model: Like,
        attributes: []
      }
    ],
    group: ['Post.post_id', 'user.user_id']
  });
  return post;
});


// -- Get post by UserId
export const getPostById = controllerWrapper(async (req: Request, res: Response) => {
  const userId = req.body.userId; 
  const post = await Post.findOne({ where: { user_id: userId } });
  if (!post) {
    res.status(404);
    return { message: 'Post not found' };
  }
  return post;
});


// -- Update post
export const updatePost = controllerWrapper(async (req: Request, res: Response) => {
  const postId = req.params.postId; // Ambil post_id dari parameter URL
  const { title, content } = req.body;
  const post = await Post.findOne({ where: { post_id: postId } });
  if (!post) {
    res.status(404);
    return { message: 'Post not found' };
  }
  post.title = title;
  post.content = content;
  await post.save();
  return post;
});


// -- Delete post
export const deletePost = controllerWrapper(async (req: Request, res: Response) => {
  const postId = req.params.postId; 

  const post = await Post.findOne({ where: { post_id: postId } });
  if (!post) {
    res.status(404);
    return { message: 'Post not found' };
  }

  await post.destroy();
  return { message: 'Post deleted successfully' };
});



// -- get post content       ga kepake
export const getPostContent = controllerWrapper(async (req: Request, res: Response) => {
  const postId = req.params.postId; // Ambil post_id dari parameter URL
  const post = await Post.findOne({ where: { post_id: postId } });
  if (!post) {
    res.status(404);
    return { message: 'Post not found' };
  }
  return { content: post.content };
});



// -- get post title          // ga kepake
export const getPostTitle = controllerWrapper(async (req: Request, res: Response) => {
  const postId = req.params.postId; // Ambil post_id dari parameter URL
  const post = await Post.findOne({ where: { post_id: postId } });
  if (!post) {
    res.status(404);
    return { message: 'Post not found' };
  }
  return { title: post.title };
});



//get my post

export const getMyPost = controllerWrapper(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const posts = await Post.findAll({
    where: { user_id: userId },
    attributes: [
      'post_id',
      'title',
      'content',
      'user_id',
      'image_url',
      'category',
      'createdAt',
      'updatedAt',
      [fn('COUNT', col('likes.like_id')), 'totalLikes']
    ],
    include: [
      {
        model: User,
        attributes: ['username']
      },
      {
        model: Like,
        attributes: []
      }
    ],
    group: ['Post.post_id', 'user.user_id']
  });
  return posts;
});

