import { redis, es, config, mongo } from "./_base"
import {updateId, log, expandIds} from "./scripts/utils"
let crawler = require("./crawlers/movie").default

async function getId() {
      return redis.rpoplpushAsync('mtime', 'mtime.pending')
  }
function crawlCompleted(index) {
    return redis.multi()
      .lpush('mtime.completed', updateId(index))
      .lrem('mtime.pending', 0, index)
      .execAsync()
  }
function requeue(index) {
    return redis.rpushAsync('mtime', updateId(index))
  }

function save(ret){
console.log(ret)
}
function error(){
    return true
}

function crawl(index){
    return crawler(expandIds(index))
}

function minutes(n){
    return 1000*60*n
}
function crawlAllCompleted(){
    setTimeout(run,minutes(3))
}
async function run() {
    // console.log(await crawler())
    let index=await getId()
    console.log('redis movies id is:'+index)
    if(index==null ||index===0){
      crawlAllCompleted()
    }else{
      await crawl(index)
      .then(async function (ret){
        if(await save(ret)){
          await crawlCompleted(index)
        }else{
          console.log(`crawl ${index} error`)
          await requeue(index)
        }
        setImmediate(run)
      })
      .catch(async function(err){
        if(await error(err)){
          console.log('error but catch,retry now!')
          await requeue(index)
          setImmediate(run)
        }else{
          console.log(new Date())
          console.log('undefined error type')
          console.log(error)
          process.exit(1)
        }

      })
    }
    
}
run()