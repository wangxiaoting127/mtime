import * as Epona from "eponajs"
import { korok } from "korok"
import { trim, map, replace } from "lodash"
let movieids=[40205,40206]
export default async function (movieids) {
  console.log(movieids)
 let movieUrls = movieids.map(x => {
    return {
        default: { _id: x, created_at: new Date }
      , url: `http://movie.mtime.com/${x}/details.html`
    }
  })
  if (movieUrls.length == 1) { movieUrls = movieUrls[0] }

  let ret =await Epona.get(movieUrls, {
    title: '.db_head h1 a::text()',
    pro_company: {
      sels: '.wp49:nth-of-type(1) ul li *',
      nodes: {
        a: 'a::text()|trim',
        span: 'span::text()|trim'
      }
    },
    publisher: {
      sels: '.wp49:nth-of-type(2) ul li *',
      nodes: {
        a: 'a::text()|trim',
        span: 'span::text()|trim'
      }
    }
  }, {
      // concurrent: 2
      rateLimit: 1000
    })
    ret.pro_company=ret.pro_company.map(x=>{
        let y=x.a+x.span
       return  x=y.toString().replace('&nbsp;&nbsp;','')
    })
    ret.publisher=ret.publisher.map(x=>{
        let y=x.a+x.span
       return  x=y.toString().replace('&nbsp;&nbsp;','')
    })
  return ret
}
