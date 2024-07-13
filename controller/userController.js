import { UserModel } from '../models/UserSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({
                message: "Required fields are missing!",
                status: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (user) {
            return res.json({
                message: "Email address already in use!",
                status: false
            });
        }

        const newUser = new UserModel({
            name,
            email,
            password // Directly use the plain password, it will be hashed in the pre-save hook
        });

        const userResponse = await newUser.save();

        res.json({
            data: userResponse,
            message: "Successfully signed up!",
            status: true
        });
    } catch (error) {
        res.json({
            message: error.message,
            status: false,
            data: [],
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                message: "Required fields are missing!",
                status: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.json({
                message: "Email or Password not valid!",
                status: false,
                data: [],
            });
        }

        const comparePass = await bcrypt.compare(password, user.password);

        if (!comparePass) {
            return res.json({
                message: "Email or Password not valid!",
                status: false,
                data: [],
            });
        }

        const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({
            message: "User logged in successfully!",
            status: true,
            data: user,
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.json({
            message: error.message,
            status: false,
            data: [],
        });
    }
};

export const subscribeToCreator = async (req, res) => {
    try {
        const { userId, creatorId } = req.body;

        if (!userId || !creatorId) {
            return res.json({
                message: "Required fields are missing!",
                status: false
            });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.subscriptions.includes(creatorId)) {
            user.subscriptions.push(creatorId);
            await user.save();
        }

        res.json({
            message: "Successfully subscribed to the creator!",
            status: true,
            data: user
        });
    } catch (error) {
        res.json({
            message: error.message,
            status: false,
            data: [],
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getUserByID = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};