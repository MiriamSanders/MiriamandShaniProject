const express = require("express");
const router = express.Router();
const { GenericGet, GenericPost, GenericPut, GenericDelete,writeToLog } = require("../../DL/genericDL");
const { authenticateToken } = require("../middlewere/handleToken");
router.get('/', async(req, res) => {
    try {
        const user=authenticateToken(req.headers.authorization)
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
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
        const user=authenticateToken(req.headers.authorization);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const comment= await GenericPost("comments", req.body);
        writeToLog({ "timestamp": new Date(), "action": "comment add success","table":"comments","itemID": comment.id })
        res.status(201).json( comment); 
    } catch (error) {
        writeToLog({ "timestamp": new Date(), "action": "comment add failed","table":"comments" })
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const user=authenticateToken(req.headers.authorization);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const updatedComment = await GenericPut("comments", req.params.id, req.body);
        if (!updatedComment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        res.status(200).json(updatedComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const user=authenticateToken(req.headers.authorization);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const affectedRows = await GenericDelete("comments", req.params.id);
        if (affectedRows === 0) {
            return res.status(404).json({ error: "Comment not found" });
        }
        writeToLog({ "timestamp": new Date(), "action": "post delete success","table":"topostdos","itemID": req.params.id })
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
);
module.exports = router