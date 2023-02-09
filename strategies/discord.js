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
 * @type {import('./strategies').Strategy}
 */
const strategy = async function getJobs() {
  try {
    const messages = (await Promise.all(channels.map(getMessages))).flat();

    return messages
      .filter((message) => {
        if (message.author.bot) {
          return false;
        }

        if (!message.content.toLowerCase().includes("[hiring]")) {
          return false;
        }

        return true;
      })
      .map((message) => {
        const serverId = servers[message.channel_id];
        const link = `https://discord.com/channels/${serverId}/${message.channel_id}/${message.id}`;
        const footer = `\n\nLink: ${link}`;

        // Trim message because Telegram has max character limit of 4096.
        const telegramMessage =
          message.content.substring(0, 4096 - footer.length) + footer;

        return {
          id: `${serverId}:${message.channel_id}:${message.id}`,
          message: telegramMessage,
        };
      });
  } catch (e) {
    console.error(e);
    // @TODO: handle expired token
    return [];
  }
};

module.exports = strategy;
