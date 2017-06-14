let crawler = require("./crawlers/movie").default

function getId() {
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

function save(){

}
function error(){
    return true
}

function crawl(index){
    return crawler(expandIds(index))
}

async function run() {
    console.log(await crawler())
}
run()