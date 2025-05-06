const express = require("express");
const { GenericGet, GenericPost, GenericPut, CascadeDelete } = require("../../DL/genericDL");
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const albums = await GenericGet("albums", "userId", req.query.userId);
        if (!albums) {
            return res.status(200).json([]);
        }
        res.status(200).json(albums);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
);
router.put(':id', async (req, res) => {
    try {
        const affectedRows = await GenericPut("albums", req.params.id, req.body);
        if (affectedRows === 0) {
            return res.status(404).json({ error: "Album not found" });
        }
        res.status(200).json({ message: "Album updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
);
router.post('/', async (req, res) => {
    try {
        const album = await GenericPost("albums", req.body);
        console.log(album);
        if (!album|| album.length === 0) {
            return res.status(400).json({ error: "Failed to create album" });
        }
        res.status(201).json( album[0] ); // Access the insertId from the result
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
);
router.delete("/:id", async (req, res) => {
    try {
        const affectedRows = await CascadeDelete("albums", req.params.id, "photos", "albumId");
        if (affectedRows === 0) {
            return res.status(404).json({ error: "Album not found" });
        }
        if (affectedRows === 0) {
            return res.status(404).json({ error: "Album not found" });
        }
        res.status(200).json({ message: "Album deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
module.exports = router;