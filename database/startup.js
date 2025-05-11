const mysql = require("mysql2/promise");
require('dotenv').config({ path: '../.env' });
const { faker } = require('@faker-js/faker');
async function main() {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            // password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        console.log("Connected to MySQL server");
        await db.query(`CREATE TABLE IF NOT EXISTS USER (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    userName VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    profilePicture VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE
);`);
        await db.query(`CREATE TABLE IF NOT EXISTS USERPASSWORD (
    userId INT,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (userId) REFERENCES USER(id),
    is_deleted BOOLEAN DEFAULT FALSE
);
`);
        await db.query(`CREATE TABLE IF NOT EXISTS POSTS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (userId) REFERENCES USER(id)
);
`);
        await db.query(`CREATE TABLE IF NOT EXISTS COMMENTS (
    postId INT,
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (postId) REFERENCES POSTS(id)
);`);
        await db.query(`CREATE TABLE IF NOT EXISTS TODOS (
    userId INT,
    id INT AUTO_INCREMENT PRIMARY KEY,
    body TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (userId) REFERENCES USER(id)
);`);
        await db.query(`CREATE TABLE IF NOT EXISTS ALBUMS (
    userId INT,
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (userId) REFERENCES USER(id)
);`);
        await db.query(`CREATE TABLE IF NOT EXISTS PHOTOS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    albumId INT,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (albumId) REFERENCES ALBUMS(id)
);`);
        await db.query(`CREATE TABLE IF NOT EXISTS LOGS(
        timestamp DATETIME NOT NULL,
        table VARCHAR(30),
        itemId INT,
        action VARCHAR(225)) NOT NULL;`);

        for (let i = 0; i < 5; i++) {
            const [result] = await db.query(`
            INSERT INTO USER (name, email, userName, phone, profilePicture)
            VALUES (?, ?, ?, ?, ?)`, [
                faker.person.fullName(),
                faker.internet.email(),
                faker.internet.username(),
                faker.phone.number('###-###-####'),
                faker.image.avatar()
            ]);

            const userId = result.insertId;

            // USERPASSWORD
            await db.query(`INSERT INTO USERPASSWORD (userId, password) VALUES (?, ?)`, [
                userId,
                faker.internet.password()
            ]);

            // POSTS
            for (let j = 0; j < 2; j++) {
                const [postResult] = await db.query(`
                INSERT INTO POSTS (userId, title, body) VALUES (?, ?, ?)`, [
                    userId,
                    faker.lorem.sentence(),
                    faker.lorem.paragraphs(2)
                ]);

                const postId = postResult.insertId;

                // COMMENTS
                for (let k = 0; k < 2; k++) {
                    await db.query(`INSERT INTO COMMENTS (postId, name, email, body) VALUES (?, ?, ?, ?)`, [
                        postId,
                        faker.person.fullName(),
                        faker.internet.email(),
                        faker.lorem.sentences()
                    ]);
                }
            }

            // TODOS
            for (let j = 0; j < 2; j++) {
                await db.query(`INSERT INTO TODOS (userId, body, completed) VALUES (?, ?, ?)`, [
                    userId,
                    faker.lorem.sentence(),
                    faker.datatype.boolean()
                ]);
            }

            // ALBUMS & PHOTOS
            for (let j = 0; j < 1; j++) {
                const [albumResult] = await db.query(`INSERT INTO ALBUMS (userId, title) VALUES (?, ?)`, [
                    userId,
                    faker.lorem.words(3)
                ]);

                const albumId = albumResult.insertId;

                for (let k = 0; k < 2; k++) {
                    await db.query(`INSERT INTO PHOTOS (albumId, title, url) VALUES (?, ?, ?)`, [
                        albumId,
                        faker.lorem.sentence(),
                        faker.image.url()
                    ]);
                }
            }
        }

        console.log("Fake data inserted successfully!");
        await db.end();

    } catch (error) {
        console.error(" ERROR:", error);
    } finally {

    }
}
main();