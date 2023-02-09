const { $fetch } = require("ohmyfetch");

/**
 * @type {import('./notifications').SendNotification}
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

module.exports = notify;
