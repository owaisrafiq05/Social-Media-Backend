import { CreatorModel } from '../models/CreatorSchema.js';

export const getAllCreators = async (req, res) => {
    try {
        const creators = await CreatorModel.find();
        res.json(creators);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getCreatorById = async (req, res) => {
    try {
        const creatorId = req.params.id;
        const creator = await CreatorModel.findById(creatorId);

        if (!creator) {
            return res.status(404).json({ message: 'Creator not found' });
        }

        res.json(creator);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};