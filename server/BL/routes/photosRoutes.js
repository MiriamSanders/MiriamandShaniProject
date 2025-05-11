const express = require("express");
const { GenericGet, GenericPost, GenericPut,GenericDelete } = require("../../DL/genericDL");
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const user=authenticateToken(req.headers.authorization);
        console.log(user);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
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
        const user=authenticateToken(req.headers.authorization);
        console.log(user);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
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
        const user=authenticateToken(req.headers.authorization);
        console.log(user);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const updatedPhoto = await GenericPut("photos", req.params.id, req.body);
        if (!updatedPhoto) {
            return res.status(404).json({ error: "Photo not found" });
        }
        res.status(200).json(updatedPhoto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
);
router.delete('/:id', async (req, res) => {
    try {
        const user=authenticateToken(req.headers.authorization);
        console.log(user);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { id } = req.params;
        const deletedPhoto = await GenericDelete("photos", id);
        if (!deletedPhoto) {
            return res.status(404).json({ message: 'photo not found' });
        }
        res.status(200).json({ message: 'photo deleted successfully' });
    } catch (err) {
        console.error('Error deleting photo:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router
