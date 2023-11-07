const { User, Thought } = require('../models');

const userController = {
  // Get all users
  getAllUsers(req, res) {
    User.find({})
      .select('-__v')
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  // Get a single user by its _id and populated thought and friend data
  getUserById(req, res) {
    const userId = req.params.userId;

    User.findById(userId)
      .select('-__v')
      .populate('thoughts friends')
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Create a new user
  createUser(req, res) {
    const { username, email } = req.body;

    User.create({ username, email })
      .then((newUser) => res.json(newUser))
      .catch((err) => res.status(500).json(err));
  },

  // Update a user by its _id
  updateUser(req, res) {
    const userId = req.params.userId;
    const { username, email } = req.body;

    User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Delete a user by its _id
  deleteUser(req, res) {
    const userId = req.params.userId;

    User.findByIdAndDelete(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        // Remove the user from their friends' friend lists
        return User.updateMany(
          { _id: { $in: user.friends } },
          { $pull: { friends: userId } }
        );
      })
      .then(() => {
        // Remove user's thoughts
        return Thought.deleteMany({ username: user.username });
      })
      .then(() => res.json({ message: 'User and associated thoughts deleted' }))
      .catch((err) => res.status(500).json(err));
  },

  // Add a new friend to a user's friend list
  addFriend(req, res) {
    const userId = req.params.userId;
    const { friendId } = req.params;

    User.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: friendId } },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Remove a friend from a user's friend list
  removeFriend(req, res) {
    const userId = req.params.userId;
    const { friendId } = req.params;

    User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = userController;
