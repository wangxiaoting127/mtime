import * as Epona from "eponajs"
import { korok } from "korok"
import { trim, map, replace } from "lodash"

export default async function (movieids) {
  let movieUrls = movieids.map(x => {
    return {
      default: { _id: x, created_at: new Date }
      , url: `http://movie.mtime.com/${x}/details.html`
    }
  })
  if (movieUrls.length == 1) { movieUrls = movieUrls[0] }

  let ret = await Epona.get(movieUrls, {
    title: '.db_head h1 a::text()',
    make_company: {
      sels: '.wp49:nth-of-type(1) ul li *',
      nodes: {
        _id: 'a::href|numbers',
        cname: 'a::text()|trim',
        country: 'span::text()|trim'
      }
    },
    release_company: {
      sels: '.wp49:nth-of-type(2) ul li *',
      nodes: {
        _id: 'a::href|numbers',
        cname: 'a::text()|trim',
        country: 'span::text()|trim'
      }
    },
    cost: {
      sels: '.db_movieother_2 dl:nth-of-type(2) dd::text()'
    },
    shooting_date: {
      sels: '.db_movieother_2 dl:nth-of-type(2) dd::text()'
    }
  }, {
      concurrent: 20
      // rateLimit: 1000
    })

  // ret.pro_company=ret.pro_company.map(x=>{
  //     let y=x.a+x.span
  //    return  x=y.toString().replace('&nbsp;&nbsp;','')
  // })
  // ret.publisher=ret.publisher.map(x=>{
  //     let y=x.a+x.span
  //    return  x=y.toString().replace('&nbsp;&nbsp;','')
  // })
  ret.filter(x => x).map(x => {

    if (x.cost) {
      let cost = x.cost.match(/制作成本(.*)estimated/g)
      x.cost=cost
      let shooting_date = x.shooting_date.match(/\d{4}年.*(\t?)/g)
      x.shooting_date = shooting_date
    }

  })

  console.log(ret)
  return ret
}
