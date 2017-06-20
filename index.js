import { redis, config, mongo } from "./_base"
import { updateId, log, expandIds } from "./scripts/utils"
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

async function save(ret) {
  console.log('ok!==========================================')
  let sret = ret
    .filter(x => x.title)
    .map(x => {
      x.created_at = new Date
      return x
    })
    console.log(sret)
  if (sret.length == 0) { return true }
  //？？？？
  let saved = await Companies.insertMany(sret, { ordered: false })
  console.log('saved'+saved)
  return saved.result.ok == 1

}
function error(err) {
  return true
}

function crawl(index) {
  return crawler(expandIds(index))
}

function minutes(n) {
  return 1000 * 60 * n
}
function crawlAllCompleted() {
  setTimeout(run, minutes(3))
}
async function run() {
  // console.log(await crawler())
  let index = await getId()
  console.log('//redis movies id is:' + index)
  if (index == null || index === 0) {
    crawlAllCompleted()
  } else {
    await crawl(index)
      .then(async function (ret) {
        console.log('返回爬到结果 ' + ret)
        if (await save(ret)) {
          await crawlCompleted(index)
        } else {
          console.log(`crawl ${index} error`)
          await requeue(index)
        }
        setImmediate(run)
      })
      .catch(async function (err) {
        if (await error(err)) {
          console.log('error but catch,retry now!')
          await requeue(index)
          setImmediate(run)
        } else {
          console.log(new Date())
          console.log('undefined error type')
          console.log(error)
          process.exit(1)
        }

      })
  }

}

mongo.then(x => {
  global.mongo = x
  let Companies = global.mongo.collection("companies")
  run(process.argv[2])
}).catch(x => {
  console.log(x)
})