import { CreatorModel } from '../models/CreatorSchema.js';
import OtpModel from '../models/OtpSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const signupController = async (req, res) => {
    try {
        const { username, email, password, description, socialLinks } = req.body;

        if (!username || !email || !password) {
            return res.json({
                message: "required fields are missing!",
                status: false
            });
        }

        const creator = await CreatorModel.findOne({ email });

        if (creator) {
            return res.json({
                message: "email address already in use!",
                status: false
            });
        }

        // Upload avatar to Cloudinary
        let avatarUrl = '';
        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                resource_type: "image"
            });
            avatarUrl = result.secure_url;
        }

        const newCreator = new CreatorModel({
            username,
            email,
            password, // Directly use the plain password, it will be hashed in the pre-save hook
            description,
            avatar: avatarUrl,
            socialLinks
        });

        const creatorResponse = await newCreator.save();

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Save OTP in the database
        await OtpModel.create({ otp, email });

        // Send OTP to email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Email Verification',
            text: `Your OTP for email verification is: ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.json({
                    message: "Error sending OTP email.",
                    status: false,
                    data: [],
                });
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.json({
            data: creatorResponse,
            message: "Successfully signed up! Please verify your email using the OTP sent to your email.",
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

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                message: "required fields are missing!",
                status: false
            });
        }

        const creator = await CreatorModel.findOne({ email });
        console.log("creator", creator);

        if (!creator) {
            return res.json({
                message: "Email or Password not valid!",
                status: false,
                data: [],
            });
        }

        const comparePass = await bcrypt.compare(password, creator.password);
        console.log("comparePass", comparePass);

        if (!comparePass) {
            return res.json({
                message: "Email or Password not valid!",
                status: false,
                data: [],
            });
        }

        const token = jwt.sign({ _id: creator._id, email: creator.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({
            message: "Creator login successfully!",
            status: true,
            data: creator,
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

export const otpVerification = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.json({
                message: "required fields are missing!",
                status: false
            });
        }

        const otpRes = await OtpModel.findOne({ email, otp });

        if (!otpRes || otpRes.isUsed) {
            return res.json({
                message: "Invalid OTP!",
                status: false
            });
        }

        await OtpModel.findByIdAndUpdate(otpRes._id, { isUsed: true });

        res.json({
            message: "OTP Verified!",
            status: true,
            data: []
        });

    } catch (error) {
        return res.json({
            message: error.message,
            status: false,
            data: [],
        });
    }
};
