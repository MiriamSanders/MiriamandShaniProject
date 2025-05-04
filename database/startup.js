const mysql = require("mysql2/promise");
require('dotenv').config();
async function main() {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        console.log("Connected to MySQL server");
        await db.query(`CREATE TABLE USER (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    userName VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    profilePicture VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE
);`);
        await db.query(`CREATE TABLE USERPASSWORD (
    userId INT,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (userId) REFERENCES USER(id),
    is_deleted BOOLEAN DEFAULT FALSE
);
`);
        await db.query(`CREATE TABLE POSTS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (userId) REFERENCES USER(id)
);
`);
        await db.query(`CREATE TABLE COMMENTS (
    postId INT,
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (postId) REFERENCES POSTS(id)
);`);
        await db.query(`CREATE TABLE TODOS (
    userId INT,
    id INT AUTO_INCREMENT PRIMARY KEY,
    body TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (userId) REFERENCES USER(id)
);`);
        await db.query(`CREATE TABLE ALBUMS (
    userId INT,
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (userId) REFERENCES USER(id)
);`);
        await db.query(`CREATE TABLE PHOTOS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    albumId INT,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (albumId) REFERENCES ALBUMS(id)
);`);
    }
    catch (error) {
        console.error("ERROR:", error);
    }
}
main();