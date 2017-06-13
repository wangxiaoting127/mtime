import * as Epona from "eponajs"
import { korok } from "korok"

export default function () {
  return Enopa.get("http://movie.mtime.com/40205/details.html", {
    title:'.db_head h1 a::text()',
    pro_company: '.wp49:nth-of-type(1) a::text()',
    publisher: '.wp49:nth-of-type(2) a::text()'
  }, {
      concurrent: 2
      // rateLimit: 7000
    })

}
