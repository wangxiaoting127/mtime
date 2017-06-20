import { redis, config, mongo } from "../_base"
import { includes } from "lodash"
import { updateId, log,  } from "./utils"
let schedule = require('node-schedule');
redis.on("error", function (err) {
  console.log("Error " + err);
})
// doc https://www.npmjs.com/package/redis
function usage() {

}

async function movies() {
  let tya = await redis.llenAsync('mtime.pending')
  while (tya - 5 > 0) {
    let index = await redis.rpoplpushAsync('mtime.pending', 'mtime.pending')
    if (index) {
      let [id, time] = index.split('_')
      if ((new Date).getTime() - parseInt(time) > 10 * 60 * 1000) {
        console.log('requeued:', id)
        await redis.lremAsync('mtime.pending', 0, index)
        await redis.lpushAsync('mtime', updateId(index))
      }
    } else {
      return
    }
  }
  console.log(' mtime movie urls requeued')
}

movies()
// run(process.argv[2])
let rule = new schedule.RecurrenceRule();
rule.minute = 20; rule.second = 0;
let j = schedule.scheduleJob(rule, function () {
  run(process.argv[2])
});

