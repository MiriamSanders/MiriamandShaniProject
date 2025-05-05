const mysql = require('mysql2/promise');
const dbPromise = require("../dbConnection");

async function getPosts() {
    try {
        const db = await dbPromise; // Get the database connection
        const query = mysql.format(`
        SELECT * 
        FROM posts 
        WHERE is_deleted = 0
    `);
        const [rows] = await db.execute(query);
        if (rows.length === 0) {
            return null; // No rows found
        }
        return rows;
    }catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

module.exports = {getPosts};