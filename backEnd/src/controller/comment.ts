import { Comment } from "../../models/comment";
import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { User } from "../../models/user";
import { controllerWrapper } from '../utils/controllerWrapper';

interface CommentNode {
    comment_id: string;
    content: string;
    user_id: string;
    post_id: string;
    parent_comment_id: string | null;
    replies: CommentNode[];
}

// -- get all comments from a post 
export const getCommentsByPostId = controllerWrapper(async (req: Request, res: Response) => {
    const { post_id } = req.params;

    try {
        console.log("post_id", post_id);
        // Ambil semua komentar untuk post_id tertentu
        const comments = await Comment.findAll({
            where: { post_id },
            order: [['createdAt', 'ASC']],
            include: [
                {
                    model: User,
                    attributes: ['username'],
                }
            ],
            raw: true,
        });

        // Buat dictionary agar lebih cepat mencari parent-child
        const commentMap: { [key: string]: CommentNode } = {};
        const roots: CommentNode[] = [];

        // Ubah data mentah jadi struktur node
        comments.forEach(comment => {
            commentMap[comment.comment_id] = {
                ...comment,
                replies: [],
            };
        });

        // Bangun struktur tree (bertingkat)
        comments.forEach(comment => {
            const node = commentMap[comment.comment_id];
            if (comment.parent_comment_id) {
                commentMap[comment.parent_comment_id]?.replies.push(node);
            } else {
                roots.push(node);
            }
        });
        return {
            message: "Komentar berhasil diambil",
            comments: roots
        };
    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil komentar",
            error,
        });
        return;
    }
});

export const createComment = controllerWrapper(async (req: Request, res: Response) => {
    const { content, post_id, parent_comment_id } = req.body;
    const user_id = req.body.userId;
    console.log("user_id", user_id);
    console.log("post_id", post_id);
    console.log("parent_comment_id", parent_comment_id);
    console.log("content", content);
    if (!content || !user_id || !post_id) {
        res.status(400);
        return { message: "Field wajib: content, user_id, post_id" };
    }
    const newComment = await Comment.create({
        comment_id: uuidv4(),
        content,
        user_id,
        post_id,
        parent_comment_id: parent_comment_id || null,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    res.status(201);
    return {
        message: "Komentar berhasil ditambahkan",
        comment: newComment,
    };
});

// -- get comment by id
export const getCommentById = controllerWrapper(async (req: Request, res: Response) => {
    const { comment_id } = req.params;

    try {
        const comment = await Comment.findOne({
            where: { comment_id },
        });

        if (!comment) {
            res.status(404);
            return { message: "Komentar tidak ditemukan" };
        }

        return {
            message: "Komentar berhasil diambil",
            comment,
        };
    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil komentar",
            error,
        });
        return;
    }
});

// -- update comment
export const updateComment = controllerWrapper(async (req: Request, res: Response) => {
    const { comment_id } = req.params;
    const { content } = req.body;

    try {
        const comment = await Comment.findOne({
            where: { comment_id },
        });

        if (!comment) {
            res.status(404);
            return { message: "Komentar tidak ditemukan" };
        }

        await Comment.update(
            { content },
            { where: { comment_id } }
        );

        return {
            message: "Komentar berhasil diperbarui",
        };
    } catch (error) {
        res.status(500).json({
            message: "Gagal memperbarui komentar",
            error,
        });
        return;
    }
});



// -- delete comment
export const deleteComment = controllerWrapper(async (req: Request, res: Response) => {
    // console.log("req.params:", req.params); //DEBUG
    const { comment_id } = req.params;
    // console.log("comment_id:", comment_id); // DEBUG
    try {
        const comment = await Comment.findOne({
            where: { comment_id },
        });

        if (!comment) {
            res.status(404);
            return { message: "Komentar tidak ditemukan" };
        }
        // console.log("Komentar ditemukan:", comment); // DEBUG

        await Comment.destroy({
            where: { comment_id },
        });
        // console.log("Komentar berhasil dihapus"); // DEBUG

        return {
            message: "Komentar berhasil dihapus",
        };
    } catch (error) {
        // console.error("Error saat menghapus komentar:", error); // DEBUG
        res.status(500).json({
            message: "Gagal menghapus komentar",
            error,
        });
        return;
    }
});

export const getCommentsWithUser = controllerWrapper(async (req: Request, res: Response) => {
    const comments = await Comment.findAll({
        where: { post_id: req.params.post_id },
        include: [
            {
                model: User,
                attributes: ['username', 'email']
            }
        ]
    });
    return { comments };
});