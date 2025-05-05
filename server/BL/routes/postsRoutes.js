const express = require("express");
const { GenericPost, GenericPut, CascadeDelete } = require("../../DL/genericDL");
const { getPosts } = require("../../DL/postDL");
//const dbPromise = require("../../dbConnection");
const router = express.Router();
// New GET route using the imported getPosts function
router.get('/', async (req, res) => {
    try {
        const posts = await getPosts(); // Fetch posts from the database
        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'Posts not found' });
        }
        res.status(200).json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { userId, title, body } = req.body;

        // Use GenericPost to insert a new post
        const newPost = await GenericPost("posts", { userId, title, body });

        if (!newPost) {
            return res.status(400).json({ message: 'Failed to create post' });
        }

        res.status(201).json({ message: 'post created successfully', newPost });
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body; // Get all the data from the request body

        // Use GenericPut to update the post
        const updatedPost = await GenericPut("posts", id, updatedData);

        if (!updatedPost) {
            return res.status(404).json({ message: 'post not found' });
        }

        res.status(200).json({ message: 'post updated successfully', updatedPost });
    } catch (err) {
        console.error('Error updating post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Use CascadeDelete to delete the post and the post's comments
        const deletedPost = await CascadeDelete("posts", id, "comments", "postId");

        if (!deletedPost) {
            return res.status(404).json({ message: 'post not found' });
        }

        res.status(200).json({ message: 'post and post\'s comments deleted successfully', deletedPost });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router