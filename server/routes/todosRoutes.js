const express = require("express");
const dbPromise = require("../dbConnection");
const router = express.Router();
router.get('/', async (req, res) => {
    const userId = req.query.userId;
    db.query(`SELECT * FROM todos WHERE userId = ?`, [userId])
        .then(([rows]) => {
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Todos not found' });
            }
            res.status(200).json(rows);
        })
        .catch((err) => {
            console.error('Error fetching todos:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
});
router.put(':id', async (req, res) => {
    const { id } = req.params;
    const db = await dbPromise;
    const { complete } = req.body;
});
router.post('/',);
router.delete("/:id",);
module.exports = router