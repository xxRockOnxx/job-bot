
# Vue Jobs Notification

Get notified via Telegram whenever a **[HIRING]** job post gets posted in Vue-related Discord servers.

The servers being checked are:

- [Vue Land](https://discord.gg/vue)
- [Nuxt.js](https://discord.gg/b8kMdB9W)
- [Vue Land](https://community.vuetifyjs.com)

## Run Locally

Clone the project

```bash
git clone https://github.com/xxRockOnxx/job-bot
```

Go to the project directory

```bash
cd job-bot
```

Install dependencies

```bash
yarn install
```

Configure environment variables

```
DISCORD_TOKEN=
TELEGRAM_BOT_ID=
TELEGRAM_CHAT_ID=
```

Get  your `DISCORD_TOKEN` by doing the following:

- Go to a Discord server in your browser
- Open Chrome Dev Tools (F12)
- Go to Application tab
- Click Local Storage on the side bar
- Find `token` somewhere in there

You can figure out yourself how to create Telegram bot. It's pretty simple.

Start the server

```bash
  node -r dotenv/config index.js
```

Or via docker-compose

```bash
  docker-compose up -d
```
