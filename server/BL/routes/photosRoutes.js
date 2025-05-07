const express = require("express");
const { GenericGet, GenericPost, GenericPut } = require("../../DL/genericDL");
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const { albumId, limit, _page } = req.query;
        const numericLimit = limit ? parseInt(limit) : undefined;
        const page = _page ? parseInt(_page) : 1;
        const offset = numericLimit ? (page - 1) * numericLimit : undefined;
        const photos = await GenericGet("photos", "albumId", albumId, numericLimit, offset);
        if (!photos || photos.length === 0) {
            return res.status(200).json([]);
        }
        console.log(photos);
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
        res.status(201).json(photo); // Access the insertId from the result
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
