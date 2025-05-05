const mysql = require('mysql2/promise');
const dbPromise = require("../dbConnection");

async function GenericGet(table,fieldName, fieldValue) {
    try {
        const db = await dbPromise; // Get the database connection
        const query = mysql.format(`
            SELECT * 
            FROM ?? 
            WHERE ?? = ? AND is_deleted = 0
        `, [table, fieldName, fieldValue]);
        const [rows] = await db.execute(query);
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
        const db = await dbPromise; // Get the database connection
        const query = mysql.format(`
            INSERT INTO ?? SET ?
        `, [table, data]);
      
        const [result] = await db.execute(query);
        return result.insertId; // Return the ID of the inserted row
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
        const query =mysql.format(` 
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
        const mainQuery = `
            UPDATE ?? 
            SET is_deleted = 1 
            WHERE id = ?
        `;
        await db.execute(mainQuery, [table, id]);

        // Mark the referencing records as deleted
        const cascadeQuery = `
            UPDATE ?? 
            SET is_deleted = 1 
            WHERE ?? = ?
        `;
        await db.execute(cascadeQuery, [foreignKeyTable, foreignKeyColumn, id]);

        return true; // Indicate success
    } catch (error) {
        console.error('Error performing cascade delete:', error);
        throw error;
    }
}
module.exports = { GenericGet, GenericPost, GenericPut, GenericDelete, CascadeDelete };

