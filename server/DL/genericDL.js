const mysql = require('mysql2/promise');
const dbPromise = require("../dbConnection");

async function GenericGet(table, fieldName, fieldValue, limit) {
    try {
        const db = await dbPromise; // Get the database connection
    const params = [table, fieldName, fieldValue];
    let query = `
        SELECT * 
        FROM ??
        WHERE ?? = ? AND is_deleted = 0
    `;
    if (limit) {
        query += ` LIMIT ?`;
        params.push(limit);
    }
    const [rows] = await db.execute(mysql.format(query, params));
        if (rows.length === 0) {
            return null; // No rows found
        }
        return rows;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
async function GenericPost(table, data) {
    try {
        const db = await dbPromise;

        // Insert the data
        const insertQuery = mysql.format(`INSERT INTO ?? SET ?`, [table, data]);
        const [insertResult] = await db.execute(insertQuery);

        let id = insertResult.insertId;

        if (id) {
            // If insertId exists, get the full row by id
            const selectQuery = mysql.format(`SELECT * FROM ?? WHERE id = ?`, [table, id]);
            const [rows] = await db.execute(selectQuery);
            return rows[0] || null;
        } else if (data.userId) {
            // Fallback: if insertId doesn't exist, try getting the row by userID
            const idQuery = mysql.format(`SELECT * FROM ?? WHERE userId = ?`, [table, data.userId]);
            const [rows] = await db.execute(idQuery);
            if (rows.length === 0) throw new Error('No record found for the given userID');
            return rows[0];
        } else {
            throw new Error('Insert did not return an ID, and userID was not provided.');
        }
    } catch (error) {
        console.error('Error inserting data:', error);
        throw error;
    }
}

async function GenericPut(table, id, data) {
    try {
        const db = await dbPromise;
        const query = mysql.format(`
            UPDATE ?? 
            SET ? 
            WHERE id = ?
        `, [table, data, id]);
        const [result] = await db.execute(query);
        return result.affectedRows; // Return the number of affected rows
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
}

async function GenericDelete(table, id) {
    try {
        const db = await dbPromise; // Get the database connection
        const query = mysql.format(` 
            UPDATE ?? 
            SET is_deleted = 1 
            WHERE id = ?
        `, [table, id]);
        const [result] = await db.execute(query, [table, id]);
        return result.affectedRows; // Return the number of affected rows
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
}

async function CascadeDelete(table, id, foreignKeyTable, foreignKeyColumn) {
    try {
        const db = await dbPromise; // Get the database connection

        // Mark the main record as deleted
        const mainQuery = mysql.format(`
            UPDATE ?? 
            SET is_deleted = 1 
            WHERE id = ?
        `, [table, id]);
        await db.execute(mainQuery);

        // Mark the referencing records as deleted
        const cascadeQuery = mysql.format(`
            UPDATE ?? 
            SET is_deleted = 1 
            WHERE ?? = ?
        `, [foreignKeyTable, foreignKeyColumn, id]);
        await db.execute(cascadeQuery);

        return true; // Indicate success
    } catch (error) {
        console.error('Error performing cascade delete:', error);
        throw error;
    }
}
module.exports = { GenericGet, GenericPost, GenericPut, GenericDelete, CascadeDelete };

