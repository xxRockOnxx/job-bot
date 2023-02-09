const createDb = require("./database/sqlite");
const telegram = require("./notifications/telegram");
const discord = require("./strategies/discord");

/**
 * @type {Array<[string, import('./strategies/strategies').Strategy]>}
 */
const strategies = [["discord", discord]];

async function start() {
  const db = createDb();

  await db.init();

  async function getJobs() {
    for (const [name, execute] of strategies) {
      const jobs = await execute();

      for (job of jobs) {
        const exists = await db.exists(name, job.id);

        if (exists) {
          continue;
        }

        await db.save(name, job.id);
        await telegram(job.message);
      }
    }
  }

  // Fetch jobs on start
  getJobs();

  // Fetch jobs every hour
  setInterval(getJobs, 1000 * 60 * 60);

  console.log("Started");
}

start();
