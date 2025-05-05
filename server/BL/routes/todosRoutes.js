const express = require("express");
const { GenericGet, GenericPost, GenericPut, GenericDelete } = require("../../DL/genericDL");
//const dbPromise = require("../../dbConnection");
const router = express.Router();
// New GET route using the imported getTodos function
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;
        const todos = await GenericGet("todos", "userId", userId); // Pass table name and userId to GenericGet
        if (!todos || todos.length === 0) {
            return res.status(404).json({ message: 'Todos not found' });
        }
        res.status(200).json(todos);
    } catch (err) {
        console.error('Error fetching todos:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body; // Get all the data from the request body

        // Use GenericPut to update the todo
        const updatedTodo = await GenericPut("todos", id, updatedData);

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json({ message: 'Todo updated successfully', updatedTodo });
    } catch (err) {
        console.error('Error updating todo:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/', async (req, res) => {
    try {
        const { userId, body, completed } = req.body;

        // Use GenericPost to insert a new todo
        const newTodo = await GenericPost("todos", { userId, body, completed });

        if (!newTodo) {
            return res.status(400).json({ message: 'Failed to create todo' });
        }

        res.status(201).json({ message: 'Todo created successfully', newTodo });
    } catch (err) {
        console.error('Error creating todo:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Use GenericDelete to delete the todo
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