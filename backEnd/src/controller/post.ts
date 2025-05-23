import { Post } from "../../models/post"; 
import { Request, Response } from "express";
import { User } from "../../models/user";
import { Like } from "../../models/like";
import { fn, col } from 'sequelize';

// import dayjs from 'dayjs';

// -- create post
export const createPost = async (req: any, res: any) => {
    const { title, content } = req.body;
    const user_id = req.body.user_id; 

    // const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
    try {
        const post = await Post.create({
            title,
            content,
            user_id: user_id,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        res.status(201).json({ success: true, post });
        return;
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error });
        return;
    }
}

// -- Get all posts + its post`s username + bikin virtual column totalLikes
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.findAll({
      attributes: {
        include: [
          [fn('COUNT', col('likes.like_id')), 'totalLikes']
        ]
      },
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
      group: ['Post.post_id', 'user.user_id'] // <-- pastikan ini sesuai alias include
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};


// -- Get post by UserId
export const getPostById = async (req: Request, res: Response) => {
  const userId = req.body.userId; 
  try {
    const post = await Post.findOne({ where: { user_id: userId } });
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    res.json(post);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error });
    return;
  }
};


// -- Update post
export const updatePost = async (req: Request, res: Response) => {
  const postId = req.params.postId; // Ambil post_id dari parameter URL
  const { title, content } = req.body;

  try {
    const post = await Post.findOne({ where: { post_id: postId } });
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    post.title = title;
    post.content = content;
    await post.save();

    res.json(post);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error });
    return;
  }
}
// -- Delete post
export const deletePost = async (req: Request, res: Response) => {
  const postId = req.params.postId; 

  try {
    const post = await Post.findOne({ where: { post_id: postId } });
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    await post.destroy();

    res.json({ message: 'Post deleted successfully' });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error });
    return;
  }
}

// -- get post content
export const getPostContent = async (req: Request, res: Response) => {
  const postId = req.params.postId; // Ambil post_id dari parameter URL
  try {
    const post = await Post.findOne({ where: { post_id: postId } });
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    res.json(post.content);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post content', error: error });
    return;
  }
}

// -- get post title
export const getPostTitle = async (req: Request, res: Response) => {
  const postId = req.params.postId; // Ambil post_id dari parameter URL
  try {
    const post = await Post.findOne({ where: { post_id: postId } });
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    res.json(post.title);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post title', error: error });
    return;
  }
}



//get all variable from a post by postId
export const getAllVariable = async (req: Request, res: Response) => {
  const post_id = req.params.post_id;  // dari route :post_id
  try {
    const post = await Post.findOne({
      where: { post_id: post_id },
      attributes: ['post_id', 'title', 'content', 'user_id', 'createdAt', 'updatedAt'],
      include: [{
        model: User,
        attributes: ['username'], 
      }]
    });
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


