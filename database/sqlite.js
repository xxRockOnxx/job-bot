const sqlite3 = require("sqlite3");
const path = require("path");

function initDatabase(name) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(path.join(__dirname, name), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(db);
      }
    });
  });
}

function createTableIfNotExists(db) {
  return new Promise((resolve, reject) => {
    const query = `CREATE TABLE IF NOT EXISTS jobs (
      strategy TEXT TEXT NOT NULL,
      strategy_id TEXT NOT NULL
    )`;

    db.run(query, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(db);
      }
    });
  });
}

/**
 * @returns {import('./database').Database}
 */
module.exports = function createDatabase() {
  let db;

  return {
    async init() {
      if (db) {
        return;
      }

      db = await initDatabase("jobs.db");

      await createTableIfNotExists(db);
    },

    save(strategy, id) {
      if (!db) {
        return Promise.reject(new Error("Database not initialized"));
      }

      return new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO jobs (strategy, strategy_id) VALUES (?, ?)",
          [strategy, id],
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    },

    exists(strategy, id) {
      if (!db) {
        return Promise.reject(new Error("Database not initialized"));
      }

      return new Promise((resolve, reject) => {
        db.get(
          "SELECT EXISTS(SELECT 1 FROM jobs WHERE strategy = ? AND strategy_id = ?) AS existing",
          [strategy, id],
          (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row.existing);
            }
          }
        );
      });
    },
  };
};
