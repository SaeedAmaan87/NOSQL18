const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require('../../controllers /user-controller');

// Define the user routes

// GET all users at /api/users
router.route('/').get(getAllUsers);

// GET a single user by its _id and populated thought and friend data at /api/users/:userId
router.route('/:userId').get(getUserById);

// POST a new user at /api/users
router.route('/').post(createUser);

// PUT to update a user by its _id at /api/users/:userId
router.route('/:userId').put(updateUser);

// DELETE a user by its _id at /api/users/:userId
router.route('/:userId').delete(deleteUser);

// POST to add a new friend to a user's friend list at /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(addFriend);

// DELETE to remove a friend from a user's friend list at /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').delete(removeFriend);

module.exports = router;
