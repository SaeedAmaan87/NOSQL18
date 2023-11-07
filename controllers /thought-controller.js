const { Thought, User } = require('../models');

const thoughtController = {
  // Get all thoughts
  getAllThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  // Get a single thought by its _id
  getThoughtById(req, res) {
    const thoughtId = req.params.thoughtId;

    Thought.findById(thoughtId)
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Create a new thought
  createThought(req, res) {
    const { thoughtText, username, userId } = req.body;

    Thought.create({ thoughtText, username })
      .then((newThought) => {
        // Update the associated user's thoughts array
        return User.findByIdAndUpdate(
          userId,
          { $push: { thoughts: newThought._id } },
          { new: true }
        );
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Thought created successfully' });
      })
      .catch((err) => res.status(500).json(err));
  },

  // Update a thought by its _id
  updateThought(req, res) {
    const thoughtId = req.params.thoughtId;
    const { thoughtText } = req.body;

    Thought.findByIdAndUpdate(
      thoughtId,
      { thoughtText },
      { new: true }
    )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json({ message: 'Thought updated successfully' });
      })
      .catch((err) => res.status(500).json(err));
  },

   // // Create reaction
   addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
    )
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err))

},

 // // Find reaction and delete 
 deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
    )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
},

  // Delete a thought by its _id
  deleteThought(req, res) {
    const thoughtId = req.params.thoughtId;

    Thought.findByIdAndDelete(thoughtId)
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'Thought not found' });
        }

        // Remove the thought from the associated user's thoughts array
        return User.findByIdAndUpdate(thought.username, {
          $pull: { thoughts: thoughtId },
        });
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Thought deleted successfully' });
      })
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = thoughtController;
