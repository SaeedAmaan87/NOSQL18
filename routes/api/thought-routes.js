const router = require('express').Router();
const {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
} = require('../../controllers /thought-controller');

// Define the thought routes

// GET all thoughts at /api/thoughts
router.route('/').get(getAllThoughts);

// GET a single thought by its _id at /api/thoughts/:thoughtId
router.route('/:thoughtId').get(getThoughtById);

// POST a new thought at /api/thoughts
router.route('/').post(createThought);

// PUT to update a thought by its _id at /api/thoughts/:thoughtId
router.route('/:thoughtId').put(updateThought);

// DELETE a thought by its _id at /api/thoughts/:thoughtId
router.route('/:thoughtId').delete(deleteThought);

// POST to create a reaction stored in a single thought's `reactions` array field at /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').post(addReaction)

// DELETE to pull and remove a reaction by the reaction's `reactionId` value at /api/thoughts/:thoughtId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);

module.exports = router;
