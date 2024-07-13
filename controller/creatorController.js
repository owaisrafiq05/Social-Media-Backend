import { CreatorModel } from '../models/CreatorSchema.js';

export const getAllCreators = async (req, res) => {
    try {
        const creators = await CreatorModel.find();
        res.json(creators);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
