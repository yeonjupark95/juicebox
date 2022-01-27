// grab our client with destructuring from the export in index.js
const { client, getAllUsers, createUser } = require("./index");

// new function, should attempt to create a few users
async function createInitialUser() {
  try {
    console.log("Starting to create users...");
    const albert = await createUser({
      username: "albert",
      password: "bertie99",
    });

    const sandra = await createUser({
      username: "sandra",
      password: "2sandy4me",
    });
    const glamgal = await createUser({
      username: "glamgal",
      password: "soglam",
    });

    console.log("Finished creating users!");
  } catch (error) {
    console.log("Error Creating users!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUser();
  } catch (error) {
    throw error;
  }
}

// this function should call a query which drops all tables from our database
async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
        DROP TABLE IF EXISTS users;
    `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL
        );
    `);

    console.log("Finished building tables!");
  } catch (error) {
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    const users = await getAllUsers();
    console.log("getAllUsers:", users);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error testing database!");
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
