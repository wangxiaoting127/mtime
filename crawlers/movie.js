import * as Epona from "eponajs"
import { korok } from "korok"
import { trim, map, replace, compact, unescape } from "lodash"

export default async function (movieids) {
  let movieUrls = movieids.map(x => {
    return {
      default: { film_id: x, url: `http://movie.mtime.com/${x}/details.html`, created_at: new Date }
      , url: `http://movie.mtime.com/${x}/details.html`
    }
  })
  if (movieUrls.length == 1) { movieUrls = movieUrls[0] }

  let ret = await Epona.get(movieUrls, {
    name: '.db_head h1 a::text()',
    make_company: {
      sels: '.wp49:nth-of-type(1) ul li *',
      nodes: {
        company_id: 'a::href|numbers',
        company_name: 'a::text()|trim',
        country: 'span::text()|trim',
      },
      filters: function (ret) {
        let s = ret.map(x => {
          x.country = x.country.replace(/&nbsp;/ig, '')
          return x
        })
        return s
      }
    },
    release_company: {
      sels: '.wp49:nth-of-type(2) ul li *',
      nodes: {
        company_id: 'a::href|numbers',
        company_name: 'a::text()|trim',
        country: 'span::text()|trim'
      },
      filters: function (ret) {
        let s = ret.map(x => {
          x.country = x.country.replace(/&nbsp;/ig, '')
          return x
        })
        return s
      }
    },
    cost: {
      sels: '.db_movieother_2 dd::$ ',
      filters: function (x) {
        if (x._root) {
          let s = x._root.map(x => {
            if (x.children[1].children[0]) {
              if (x.children[1].children[0].data === "制作成本：") {
                let p = x.children.map(x => {
                  if (x.name === "p") {
                    return x
                  }
                })
                // console.log(compact(p)[0].children[0].data)
                return compact(p)[0].children[0].data
              }
            }
          })
          return compact(s)[0]
        }
      }
    },
    shooting_date: {
      sels: '.db_movieother_2 dd::$ ',
      filters: function (x) {
        if (x._root) {
          let s = x._root.map(x => {
            if (x.children[1].children[0]) {
              if (x.children[1].children[0].data === "拍摄日期：") {
                let p = x.children.map(x => {
                  if (x.name === "p") {
                    return x
                  }
                })
                // console.log(compact(p)[0].children[0].data)
                let str = compact(p)[0].children[0].data
                return str = str.replace(/&nbsp;/ig, '')
              }
            }
          })
          return compact(s)[0]
        }
      }
    }
  }, {
      concurrent: 20
      // rateLimit: 1000
    })

  // console.log(ret)
  return ret
}
