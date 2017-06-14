import { split } from "lodash"
import { config } from "../_base"
import * as expand from 'expand-range'
let util = require('util')

export function updateId(i) {
  let s = split(i, '_', 1)
  return `${s}_${Date.now()}`
}

export function log(x){
  console.log(util.inspect(x, { showHidden: true, depth: null }))
}

export function postUrl(index) {
  //[ 'http://bbs.tianya.cn/list-free-1.shtml' ]
  let s = split(index, '_', 1)
  console.log("movieUrl :",s)
  return s
}