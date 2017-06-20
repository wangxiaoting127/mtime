import * as Redis from 'redis'
import * as Promise from 'bluebird'
import * as elasticsearch from 'elasticsearch'
import * as fs from 'fs'
import {trim} from 'lodash'
export const env=fs.existsSync('./env')?fs.readFileSync('./env','utf8'):'dev'
export let config=require(`./config/${trim(env)}.js`)
import * as request from 'request-promise'
import { MongoClient } from 'mongodb'
Promise.promisifyAll(Redis.RedisClient.prototype)
Promise.promisifyAll(Redis.Multi.prototype)

export let redis=Redis.createClient(config.redisOpts)

redis.on("error",function(err){
    console.log("Error"+err)
})

export let mongo=MongoClient.connect(config.mongoUrl)