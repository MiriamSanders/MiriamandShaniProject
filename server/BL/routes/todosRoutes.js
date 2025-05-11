const express = require("express");
const { GenericGet, GenericPost, GenericPut, GenericDelete } = require("../../DL/genericDL");
const { authenticateToken } = require("../middlewere/handleToken");
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const user = authenticateToken(req.headers.authorization);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const todos = await GenericGet("todos", "userId", user.id);
        if (!todos || todos.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(todos);
    } catch (err) {
        console.error('Error fetching todos:', err);
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
        const updatedTodo = await GenericPut("todos", id, updatedData);
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json(updatedTodo);
    } catch (err) {
        console.error('Error updating todo:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/', async (req, res) => {
    try {
        const user = authenticateToken(req.headers.authorization);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { userId, body, completed } = req.body;
        const newTodo = await GenericPost("todos", { userId, body, completed });
        if (!newTodo) {
            return res.status(400).json({ message: 'Failed to create todo' });
        }
        res.status(201).json(newTodo);
    } catch (err) {
        console.error('Error creating todo:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const user = authenticateToken(req.headers.authorization);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { id } = req.params;
        const deletedTodo = await GenericDelete("todos", id);
        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
        console.error('Error deleting todo:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router