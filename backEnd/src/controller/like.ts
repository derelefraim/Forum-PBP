import { Like } from "../../models/like"; 
import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';



// -- like a post
export const likePost = async (req: Request, res: Response) => {
    const { post_id } = req.params;
    const { userId: user_id } = req.body; // Ambil user_id dari body request
    try {
        // Cek apakah user sudah menyukai post ini
        const existingLike = await Like.findOne({
            where: {
                post_id,
                user_id,
            },
        });
        
        console.log("user_id2", user_id);
        if (existingLike) {
            res.status(400).json({
                message: "User sudah menyukai post ini",
            });
            return;
        }
        console.log("user_id3", user_id);
        // Buat like baru
        const newLike = await Like.create({
            like_id: uuidv4(),
            post_id,
            user_id,
        });

        res.status(201).json({
            message: "Post berhasil disukai",
            like: newLike,
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal menyukai post",
            error,
        });
    }
};

// -- unlike a post
export const unlikePost = async (req: Request, res: Response) => {
    const { post_id } = req.params;
    const { userId: user_id } = req.body; // Ambil user_id dari body request

    try {
        // Cek apakah user sudah menyukai post ini
        const existingLike = await Like.findOne({
            where: {
                post_id,
                user_id,
            },
        });

        if (!existingLike) {
            res.status(400).json({
                message: "User belum menyukai post ini",
            });
            return;
        }

        // Hapus like
        await Like.destroy({
            where: {
                post_id,
                user_id,
            },
        });

        res.status(200).json({
            message: "Post berhasil diunlike",
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal mengunlike post",
            error,
        });
    }
};

// -- get all likes for a post
export const getAllLikesForPost = async (req: Request, res: Response) => {
    const { post_id } = req.params;
    
    try {
        const likes = await Like.count({
            where: {
                post_id,
            },
        });

        res.status(200).json({
            message: "Berhasil mengambil semua like untuk post ini",
            likes,
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil semua like untuk post ini",
            error,
        });
    }
};

    // -- get status user like
    export const getUserLikeStatus = async (req: Request, res: Response) => {
        const { post_id } = req.params;
        const { userId: user_id } = req.body;
        try {
            // Cek apakah user sudah menyukai post ini
            const existingLike = await Like.findOne({
                where: {
                    post_id,
                    user_id,
                },
            });

            if (existingLike) {
                res.status(200).json({
                    message: "User sudah menyukai post ini",
                    status: true
                });
            } else {
                res.status(200).json({
                    message: "User belum menyukai post ini",
                    status: false,
                });
            }
        } catch (error) {
            res.status(500).json({
                message: "Gagal mengambil status like",
                error,
            });
        }
    }