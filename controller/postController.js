import { PostModel } from '../models/PostSchema.js';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const createPost = async (req, res) => {
    const { creator, content } = req.body;
    let images = [];
    let videos = [];

    try {
        // Upload images and videos to Cloudinary
        if (req.files) {
            const imageFiles = req.files['images'] || [];
            const videoFiles = req.files['videos'] || [];

            for (const file of imageFiles) {
                const result = await cloudinary.v2.uploader.upload(file.path, {
                    resource_type: "image"
                });
                images.push(result.secure_url);
                fs.unlinkSync(file.path);  // Remove the temporary file
            }

            for (const file of videoFiles) {
                const result = await cloudinary.v2.uploader.upload(file.path, {
                    resource_type: "video"
                });
                videos.push(result.secure_url);
                fs.unlinkSync(file.path);  // Remove the temporary file
            }
        }

        const post = new PostModel({
            creator,
            content,
            images,
            videos
        });

        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await PostModel.find();
        res.json(posts);
    } catch (err) {
        res.status (500).json({ message: 'Server error', error: err.message });
    }
};

// New function to get a post by ID
export const getPostById = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const updatePost = async (req, res) => {
    const { content } = req.body;
    let images = [];
    let videos = [];

    try {
        let post = await PostModel.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Upload new files to Cloudinary if they exist
        if (req.files) {
            const imageFiles = req.files['images'] || [];
            const videoFiles = req.files['videos'] || [];

            for (const file of imageFiles) {
                const result = await cloudinary.v2.uploader.upload(file.path, {
                    resource_type: "image"
                });
                images.push(result.secure_url);
                fs.unlinkSync(file.path);  // Remove the temporary file
            }

            for (const file of videoFiles) {
                const result = await cloudinary.v2.uploader.upload(file.path, {
                    resource_type: "video"
                });
                videos.push(result.secure_url);
                fs.unlinkSync(file.path);  // Remove the temporary file
            }
        }

        post.content = content || post.content;
        post.images = images.length ? images : post.images;
        post.videos = videos.length ? videos : post.videos;
        post.updatedAt = Date.now();

        await post.save();
        res.json(post);
    } catch (err) {
        res.status (500).json({ message: 'Server error', error: err.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await PostModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};