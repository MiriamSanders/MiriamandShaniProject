const express = require("express");
const { GenericGet, GenericPost, GenericPut } = require("../../DL/genericDL");
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const { albumId, limit } = req.query;
        const numericLimit = limit ? parseInt(limit) : undefined;
        const photos = await GenericGet("photos", "albumId", albumId, numericLimit);
        if (!photos || photos.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(photos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
);
router.post('/', async (req, res) => {
    try {
        const photo = await GenericPost("photos", req.body);
        res.status(201).json(photo[0]); // Access the insertId from the result
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
);
router.put('/:id', async (req, res) => {
    try {
        const affectedRows = await GenericPut("photos", req.params.id, req.body);
        if (affectedRows === 0) {
            return res.status(404).json({ error: "Photo not found" });
        }
        res.status(200).json({ message: "Photo updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
);
module.exports = router
