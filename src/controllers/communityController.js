// controllers/communityController.js
import Community from '../models/communityModel.js';
import { sendResponse } from '../utils/response.js';
import { sendToAll } from '../socket/socketServer.js';

export const createCommunityPost = async (req, res) => {
    try {
        let post = await Community.create(req.body);
        if (!post) {
            return sendResponse(res, 400, 'Failed to create community post');
        }
        post = await post.populate('userId', 'mobileNo');
        if (req.body.replyId) {
            const replyPost = await Community.findByIdAndUpdate(
                req.body.replyId,
                { $inc: { reply: 1, commentCount: 1 } },
                { new: true }
            );
        }
        sendToAll('community-all-msgs', {
            userId: post.userId,
            msg: post.msg,
            like: post.like,
            commentCount: post.commentCount,
            reply: post.reply,
            replyId: post.replyId,
            _id: post._id
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
        const post = await Community.findByIdAndUpdate(req.params.id, req.body, { new: true });
        sendResponse(res, 200, 'Community post updated', post);
    } catch (err) {
        sendResponse(res, 500, err.message);
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