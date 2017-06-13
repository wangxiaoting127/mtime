 
 
 
 
 async function movies() {
  let ti = config.MIN_TOPIC_ID
  do {
    await redis.lpushAsync('zhihu.topics', `${ti}_${Date.now()}`)
  } while ((ti += config.ID_PER) < config.MAX_TOPIC_ID)  
  console.log('zhihu topics id added')
}