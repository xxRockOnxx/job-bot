const sqlite3 = require('sqlite3');
const { $fetch } = require("ohmyfetch");

// Used so we can map back channel to server
// without having to fetch the server info.
const servers = {
  // Vue Land
  "325675277046906881": "325477692906536972",

  // Vuetify
  "364131435302486026": "340160225338195969",

  // Nuxt
  "530170915766534174": "473401852243869706",
};

// Jobs channel of the above servers
const channels = [
  "325675277046906881",
  "364131435302486026",
  "530170915766534174",
];

/**
 * @returns {Promise<sqlite3.Database>}
 */
function initDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(__dirname + "/jobs.db", (err) => {
      if (err) {
        reject(err);
      } else {
        db.run(`CREATE TABLE IF NOT EXISTS jobs (
          id TEXT PRIMARY KEY,
          channel_id TEXT NOT NULL
        )`)
        resolve(db);
      }
    });
  })
}

/**
 * Create the table that will store the job posts if it does not exist.
 * @param {sqlite3.Database} db
 * @returns {Promise<void>}
 */
function createTable(db) {
  return new Promise((resolve, reject) => {
    const query = `CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      channel_id TEXT NOT NULL
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
 * Check if a job post exists in the database.
 * @param {sqlite3.Database} db
 * @param {string} id
 * @returns {Promise<boolean>}
 */
function doesExist(db, id) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT EXISTS(SELECT 1 FROM jobs WHERE id = ?) AS existing",
      [id],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.existing);
        }
      }
    );
  });
}

/**
 * Save a job post in the database.
 * @param {sqlite3.Database} db
 * @param {string} id
 * @param {string} channelId
 * @returns
 */
function save(db, id, channelId) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO jobs (id, channel_id) VALUES (?, ?)",
      [id, channelId],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

/**
 * Get messages from a channel in Discord.
 * @param {string} channelId
 * @returns {Promise<Array<Object>>}
 */
function getMessages(channelId) {
  return $fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    headers: {
      Authorization: process.env.DISCORD_TOKEN,
    },
  });
}

/**
 * Send a message to Telegram
 * @param {string} message
 * @returns {Promise<void>}
 */
function notify(message) {
  return $fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_ID}/sendMessage`,
    {
      method: "POST",
      body: {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
      },
    }
  );
}

async function start() {
  console.log("Checking...");

  const db = await initDatabase();

  await createTable(db);

  const messages = (await Promise.all(channels.map(getMessages))).flat();

  console.log("Messages received.");

  for (const message of messages) {
    if (message.author.bot) {
      continue;
    }

    if (!message.content.toLowerCase().includes("[hiring]")) {
      continue;
    }

    if (await doesExist(db, message.id)) {
      continue;
    }

    // Save in cache so we don't notify again about this message (job post).
    await save(db, message.id, message.channel_id);

    console.log("Notifying...");

    // Add the link to the message so we can easily click on it.
    const serverId = servers[message.channel_id];
    const link = `https://discord.com/channels/${serverId}/${message.channel_id}/${message.id}`;
    const footer = `\n\nLink: ${link}`;

    // Trim message because Telegram has max character limit of 4096.
    const telegramMessage = message.content.substring(0, 4096 - footer.length) + footer;

    await notify(telegramMessage);
  }
}

console.log("Starting...");

start();

// Fetch every hour
setInterval(start, 1000 * 60 * 60);
