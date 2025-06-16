// controllers/communityController.js
import Community from '../models/communityModel.js';
import { sendResponse } from '../utils/response.js';
import { sendToAll } from '../socket/socketServer.js';

export const createCommunityPost = async (req, res) => {
    try {
        // Create post
        let post = await Community.create(req.body);
        if (!post) {
            return sendResponse(res, 400, 'Failed to create community post');
        }

        // Populate user info
        post = await post.populate('userId', 'mobileNo');

        // If this post is a reply to another post
        if (req.body.replyId) {
            await Community.findByIdAndUpdate(
                req.body.replyId,
                {
                    $inc: { reply: 1, commentCount: 1 }
                },
                { new: true }
            );
        }

        // Emit message to all clients
        sendToAll('community-all-msgs', {
            _id: post._id,
            userId: post.userId,
            msg: post.msg,
            like: post.like || [],
            commentCount: post.commentCount,
            reply: post.reply,
            replyId: post.replyId || null
        });

        console.log(post);
        sendResponse(res, 201, 'Community post created', post);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};


export const getCommunityPosts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const posts = await Community.find({ replyId: null })
            .populate('userId', 'mobileNo name')
            .limit(limit);
        sendResponse(res, 200, 'Community posts fetched', posts);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const updateCommunityPost = async (req, res) => {
    try {
        const { userId } = req.body;
        const { id } = req.params;

        const post = await Community.findById(id);
        if (!post) return sendResponse(res, 404, 'Community post not found');

        if (userId) {
            const alreadyLiked = post.like.includes(userId);

            if (alreadyLiked) {
                // Unlike
                post.like = post.like.filter(id => id !== userId);
            } else {
                // Like
                post.like.push(userId);
            }

            await post.save();

            return sendResponse(res, 200, alreadyLiked ? 'Post unliked' : 'Post liked', {
                post,
                likeCount: post.like.length
            });
        } else {
            // Normal update if no userId
            const updatedPost = await Community.findByIdAndUpdate(id, req.body, { new: true });
            return sendResponse(res, 200, 'Community post updated', updatedPost);
        }

    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};

export const deleteCommunityPost = async (req, res) => {
    try {
        // Find the post to check for replyId before deleting
        const post = await Community.findById(req.params.id);
        if (!post) {
            return sendResponse(res, 404, 'Community post not found');
        }

        // If the post is a reply, decrement reply and commentCount on the parent post
        if (post.replyId) {
            await Community.findByIdAndUpdate(
                post.replyId,
                { $inc: { reply: -1, commentCount: -1 } }
            );
        }

        await Community.findByIdAndDelete(req.params.id);
        sendResponse(res, 200, 'Community post deleted');
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};


export const getReplyCommunityPostsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Community.find({ replyId: userId }).populate('userId', 'mobileNo');
        sendResponse(res, 200, 'Community posts fetched by user', posts);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};