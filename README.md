
# Job bot

A simple node app that fetches job and sends notifications.

You can create strategies on how to fetch, save, send jobs.

You can check the existing implementations to see how simple it is to use.

---

Since I'm a fullstack developer that's currently interested in frontend jobs,
I made a strategy that will get jobs from Discord servers related to Vue.js.

The servers being checked are:

- [Vue Land](https://discord.gg/vue)
- [Nuxt.js](https://discord.gg/b8kMdB9W)
- [Vuetify](https://community.vuetifyjs.com)

Since these servers have a strict rule of having the keywords `[HIRING]` or `[FOR HIRE]` when
posting to their `#jobs` channels, it is as simple as checking if the message contains `[HIRING]`.

I also use Telegram personally so I made a Telegram notification implementation as well that is
as simple as sending a POST request to an endpoint.

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

---

If you are interested in using the default strategies I made for myself,
configure environment variables in `docker-compose.yml` or create an `.env` file with the following content

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

Or just check Network tab and get the value from `Authorization` header.

You can figure out yourself how to create Telegram bot. It's pretty simple.

Start the server

```bash
node -r dotenv/config index.js
```

Or via docker-compose

```bash
docker-compose up -d
```
