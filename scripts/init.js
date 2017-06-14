 import { redis, config, mongo } from "../_base"
import { includes } from "lodash"
redis.on("error", function (err) {
  console.log("Error " + err);
})
// doc https://www.npmjs.com/package/redis
function usage() {

}
 
 async function movies() {
  let ti = config.MIN_MOVIE_ID
  do {
    await redis.lpushAsync('mtime', `${ti}_${Date.now()}`)
  } while ((ti += config.ID_PER) < config.MAX_MOVIE_ID)  
  console.log('mtime movies id added')
}