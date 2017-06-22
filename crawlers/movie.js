import * as Epona from "eponajs"
import { korok } from "korok"
import { trim, map, replace, compact,unescape } from "lodash"

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
      sels: '.db_movieother_2 dd::$ ',
      filters:function (x) {
        if (x._root) {
           let s=x._root.map(x => {
            if (x.children[1].children[0].data === "制作成本：") {
              let p = x.children.map(x => {
                if (x.name === "p") {
                  return x
                }
              })
              // console.log(compact(p)[0].children[0].data)
              return compact(p)[0].children[0].data
            }

          })
          console.log(compact(s))   
          return compact(s)[0]
        }
      }
    },
    shooting_date: {
      sels: '.db_movieother_2 dd::$ ',
      filters:function (x) {
        if (x._root) {
           let s=x._root.map(x => {
            if (x.children[1].children[0].data === "拍摄日期：") {
              let p = x.children.map(x => {
                if (x.name === "p") {
                  return x
                }
              })
              // console.log(compact(p)[0].children[0].data)
              return compact(p)[0].children[0].data
            }

          })
          console.log(compact(s))   
          return compact(s)[0]
        }
      }
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


  // console.log(ret)
  return ret
}
