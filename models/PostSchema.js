import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Creator',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    images: [String],
    videos: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export const PostModel = mongoose.model("Post", PostSchema);
