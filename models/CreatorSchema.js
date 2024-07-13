import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const CreatorSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    description: String,
    avatar: String,
    socialLinks: [String]
});

// Encrypt password before saving creator
CreatorSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

export const CreatorModel = mongoose.model("Creator", CreatorSchema);
