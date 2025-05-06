const express = require("express");
const router = express.Router();
const { GenericGet, GenericPost, GenericPut, GenericDelete } = require("../../DL/genericDL");
router.get('/', async(req, res) => {
    try {
        const comments = await GenericGet("comments","postId",req.query.postId );
        if (!comments) {
            return res.status(200).json([]);
        }
        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.post('/', async (req, res) => {
    try {
        const comment= await GenericPost("comments", req.body);
        res.status(201).json( comment[0] ); // Access the insertId from the result
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const affectedRows = await GenericPut("comments", req.params.id, req.body);
        if (affectedRows === 0) {
            return res.status(404).json({ error: "Comment not found" });
        }
        res.status(200).json({ message: "Comment updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const affectedRows = await GenericDelete("comments", req.params.id);
        if (affectedRows === 0) {
            return res.status(404).json({ error: "Comment not found" });
        }
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
);
module.exports = router