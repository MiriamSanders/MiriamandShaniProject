const express = require("express");
const { GenericPost, GenericPut, CascadeDelete ,writeToLog} = require("../../DL/genericDL");
const { getPosts } = require("../../DL/postDL");
const { authenticateToken } = require("../middlewere/handleToken");
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const user = authenticateToken(req.headers.authorization);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const posts = await getPosts();
        if (!posts || posts.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const user = authenticateToken(req.headers.authorization);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const {  title, body } = req.body;
        const newPost = await GenericPost("posts", { "userId":user.id, title, body });
        if (!newPost) {
            writeToLog({ "timestamp": new Date(), "action": "post add failed","table":"posts" })
            return res.status(400).json({ message: 'Failed to create post' });
        }
        writeToLog({ "timestamp": new Date(), "action": "post add success","table":"posts","itemID": newPost.id })
        res.status(201).json(newPost); 
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const user = authenticateToken(req.headers.authorization);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { id } = req.params;
        const updatedData = req.body; 
        const updatedPost = await GenericPut("posts", id, updatedData);
        if (!updatedPost) {
            return res.status(404).json({ message: 'post not found' });
        }
        res.status(200).json(updatedPost);
    } catch (err) {
        console.error('Error updating post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const user = authenticateToken(req.headers.authorization);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { id } = req.params;
        const deletedPost = await CascadeDelete("posts", id, "comments", "postId");
        if (!deletedPost) {
            return res.status(404).json({ message: 'post not found' });
        }
        writeToLog({ "timestamp": new Date(), "action": "post delete success","table":"posts","itemID": id })
        res.status(200).json({ message: 'post and post\'s comments deleted successfully', deletedPost });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router