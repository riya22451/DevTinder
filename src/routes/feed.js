const express = require('express');
const feedRouter = express.Router();
const User = require('../models/user.js');
const authUser = require('../../middlewares/auth.middleware.js');
const Connection = require('../models/connection.js');

feedRouter.get('/', authUser, async (req, res) => {
    const user = req.user;

    try {
        const id = user._id;

        const users = await User.find({ _id: { $ne: id } });

        const connections = await Connection.find({
            $or: [{ fromUserId: id }, { toUserId: id }]
        });

        const finalusers = users.filter((usr) => {
            for (const conn of connections) {
                if (
                    (conn.fromUserId.equals(id) && conn.toUserId.equals(usr._id)) ||
                    (conn.toUserId.equals(id) && conn.fromUserId.equals(usr._id))
                ) {
                    return false;
                }
            }
            return true;
        });

        if (finalusers.length === 0) {
            throw new Error('No users found');
        }

        res.status(200).json({ finalusers });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = feedRouter;
