import User from '../models/user.js';
import { redisClient } from '../services/cacheService.js';

// Create User
export const createUser = async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get User by Account Number
export const getUserByAccountNumber = async (req, res) => {
    const accountNumber = req.params.accountNumber;
    try {
        const cachedUser = await redisClient.get(`user:${accountNumber}`);
        if (cachedUser) {
            return res.send(JSON.parse(cachedUser));
        }
        const user = await User.findOne({ accountNumber });
        if (!user) {
            return res.status(404).send();
        }
        await redisClient.set(`user:${accountNumber}`, JSON.stringify(user), 'EX', 3600);
        res.send(user);
    } catch (error) {
        res.status(500).send();
    }
};

// Get User by Identity Number
export const getUserByIdentityNumber = async (req, res) => {
    const identityNumber = req.params.identityNumber;
    try {
        const cachedUser = await redisClient.get(`user:${identityNumber}`);
        if (cachedUser) {
            return res.send(JSON.parse(cachedUser));
        }
        const user = await User.findOne({ identityNumber });
        if (!user) {
            return res.status(404).send();
        }
        await redisClient.set(`user:${identityNumber}`, JSON.stringify(user), 'EX', 3600);
        res.send(user);
    } catch (error) {
        res.status(500).send();
    }
};

// Update User
export const updateUser = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['userName', 'emailAddress'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const user = await User.findOne({ accountNumber: req.params.accountNumber });
        if (!user) {
            return res.status(404).send();
        }

        updates.forEach((update) => (user[update] = req.body[update]));
        await user.save();
        await redisClient.set(`user:${user.accountNumber}`, JSON.stringify(user), 'EX', 3600);
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete User
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ accountNumber: req.params.accountNumber });
        if (!user) {
            return res.status(404).send();
        }
        await redisClient.del(`user:${user.accountNumber}`);
        res.send(user);
    } catch (error) {
        res.status(500).send();
    }
};
